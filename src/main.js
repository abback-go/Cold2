import {
  currentSpeed,
  spawnInterval,
  currentLevel,
  INITIAL_SPEED,
  MAX_SPEED,
} from './speed.js';
import { hitsAny } from './collision.js';
import { createScore, addTime, addBonus, formatScore } from './score.js';
import {
  pickSafeLane,
  createObstacle,
  isBonfire,
  shouldSpawnBonfire,
  laneToX,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LANE_COUNT,
  OBSTACLE_W,
  OBSTACLE_H,
} from './obstacle.js';

// ┌────────────────────────────────────────────┐
// │ Game state machine                          │
// │  start ──Space──> playing ──collide──> over │
// │   ^                                     │   │
// │   └──────────────R─────────────────────┘   │
// └────────────────────────────────────────────┘

const PLAYER_W = 40;
const PLAYER_H = 40;
const PLAYER_Y = CANVAS_HEIGHT - PLAYER_H - 10;
const PLAYER_SPEED = 350; // px/s, lateral movement
const BONFIRE_DURATION_MS = 500; // slow-mo window

const TIMING_BAR_COLORS = [
  '#4caf50', // green (level 0)
  '#2196f3', // blue (level 1-2)
  '#90caf9', // light blue (3-4)
  '#e3f2fd', // white (5-6)
  '#b3e5fc', // ice (7+)
];

function levelColor(level) {
  if (level <= 0) return TIMING_BAR_COLORS[0];
  if (level <= 2) return TIMING_BAR_COLORS[1];
  if (level <= 4) return TIMING_BAR_COLORS[2];
  if (level <= 6) return TIMING_BAR_COLORS[3];
  return TIMING_BAR_COLORS[4];
}

function initialState() {
  return {
    phase: 'start', // 'start' | 'playing' | 'over'
    elapsedSec: 0,
    timeSinceSpawnMs: 0,
    score: createScore(),
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_W / 2,
      y: PLAYER_Y,
      w: PLAYER_W,
      h: PLAYER_H,
    },
    inFlight: [],
    keys: { left: false, right: false },
    bonfireSlowUntilMs: 0,
    nowMs: 0,
  };
}

export function startGame(state) {
  if (state.phase === 'playing') return state;
  return { ...initialState(), phase: 'playing', nowMs: state.nowMs };
}

export function endGame(state) {
  return { ...state, phase: 'over' };
}

export function update(state, dtMs) {
  if (state.phase !== 'playing') return state;

  // Clamp deltaTime to avoid huge jumps from tab inactivity
  const safeDtMs = Math.min(Math.max(dtMs, 0), 100);
  const dtSec = safeDtMs / 1000;
  const nowMs = state.nowMs + safeDtMs;

  // Player movement
  const playerDx =
    (state.keys.right ? PLAYER_SPEED : 0) - (state.keys.left ? PLAYER_SPEED : 0);
  const newPlayerX = Math.max(
    0,
    Math.min(CANVAS_WIDTH - PLAYER_W, state.player.x + playerDx * dtSec)
  );

  // Speed and slow-mo
  const elapsedSec = state.elapsedSec + dtSec;
  const baseSpeed = currentSpeed(elapsedSec);
  const isSlowMo = nowMs < state.bonfireSlowUntilMs;
  const obstacleSpeed = isSlowMo ? baseSpeed * 0.5 : baseSpeed;

  // Move obstacles down
  let inFlight = state.inFlight
    .map(o => ({ ...o, y: o.y + obstacleSpeed * dtSec }))
    .filter(o => o.y < CANVAS_HEIGHT + OBSTACLE_H);

  // Spawn new obstacle if interval elapsed
  let timeSinceSpawnMs = state.timeSinceSpawnMs + safeDtMs;
  const interval = spawnInterval(baseSpeed);
  let scoreNext = addTime(state.score, dtSec);
  let bonfireSlowUntilMs = state.bonfireSlowUntilMs;

  if (timeSinceSpawnMs >= interval) {
    timeSinceSpawnMs = 0;
    const lane = pickSafeLane(inFlight);
    const type = shouldSpawnBonfire() ? 'bonfire' : 'obstacle';
    inFlight.push(createObstacle(lane, type));
  }

  // Collision detection
  const player = { ...state.player, x: newPlayerX };
  const obstacles = inFlight.filter(o => !isBonfire(o));
  const bonfires = inFlight.filter(o => isBonfire(o));

  const hitObstacle = hitsAny(player, obstacles);
  if (hitObstacle) {
    return {
      ...state,
      phase: 'over',
      player,
      inFlight,
      elapsedSec,
      score: scoreNext,
      timeSinceSpawnMs,
      nowMs,
    };
  }

  // Bonfire pickup
  const hitBonfire = hitsAny(player, bonfires);
  if (hitBonfire) {
    scoreNext = addBonus(scoreNext);
    bonfireSlowUntilMs = nowMs + BONFIRE_DURATION_MS;
    inFlight = inFlight.filter(o => o !== hitBonfire);
  }

  return {
    ...state,
    player,
    inFlight,
    elapsedSec,
    score: scoreNext,
    timeSinceSpawnMs,
    bonfireSlowUntilMs,
    nowMs,
  };
}

export function handleKeyDown(state, key) {
  if (key === ' ' || key === 'Space') {
    if (state.phase === 'start') return startGame(state);
  }
  if (key === 'r' || key === 'R') {
    if (state.phase === 'over') return startGame(state);
  }
  if (state.phase !== 'playing') return state;
  if (key === 'ArrowLeft') return { ...state, keys: { ...state.keys, left: true } };
  if (key === 'ArrowRight') return { ...state, keys: { ...state.keys, right: true } };
  return state;
}

export function handleKeyUp(state, key) {
  if (key === 'ArrowLeft') return { ...state, keys: { ...state.keys, left: false } };
  if (key === 'ArrowRight') return { ...state, keys: { ...state.keys, right: false } };
  return state;
}

function render(ctx, state) {
  // Background gradient based on level
  const level = currentLevel(state.elapsedSec);
  const bgIntensity = Math.min(level / 8, 1);
  const r = Math.round(15 + bgIntensity * 30);
  const g = Math.round(25 + bgIntensity * 60);
  const b = Math.round(45 + bgIntensity * 70);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Lane guides (subtle)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 1; i < LANE_COUNT; i++) {
    const x = (CANVAS_WIDTH / LANE_COUNT) * i;
    ctx.beginPath();
    ctx.moveTo(x, 30);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Timing bar (top 20px)
  const barWidth = Math.min(((state.elapsedSec % 10) / 10) * CANVAS_WIDTH, CANVAS_WIDTH);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, 20);
  ctx.fillStyle = levelColor(level);
  ctx.fillRect(0, 0, barWidth, 20);
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.fillText(`한파 레벨 ${level}`, 8, 14);

  // Obstacles
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const o of state.inFlight) {
    if (isBonfire(o)) {
      ctx.fillText('🔥', o.x + o.w / 2, o.y + o.h / 2);
    } else {
      ctx.fillText('🧊', o.x + o.w / 2, o.y + o.h / 2);
    }
  }
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';

  // Player
  ctx.font = '32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧑', state.player.x + state.player.w / 2, state.player.y + state.player.h / 2);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';

  // Score (bottom-left)
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(formatScore(state.score), 10, CANVAS_HEIGHT - 10);

  // Phase overlays
  if (state.phase === 'start') {
    drawCenterText(ctx, '한파 피하기', 36, CANVAS_HEIGHT / 2 - 30);
    drawCenterText(ctx, 'Press Space to Start', 18, CANVAS_HEIGHT / 2 + 10);
    drawCenterText(ctx, '← → 로 이동, 🔥 모닥불을 줍자', 14, CANVAS_HEIGHT / 2 + 40);
  } else if (state.phase === 'over') {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#fff';
    drawCenterText(ctx, 'GAME OVER', 36, CANVAS_HEIGHT / 2 - 40);
    drawCenterText(ctx, formatScore(state.score), 22, CANVAS_HEIGHT / 2);
    drawCenterText(ctx, 'Press R to Restart', 16, CANVAS_HEIGHT / 2 + 40);
  }
}

function drawCenterText(ctx, text, size, y) {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(text, CANVAS_WIDTH / 2, y);
  ctx.restore();
}

export function bootstrap(canvas) {
  const ctx = canvas.getContext('2d');
  let state = initialState();
  let lastFrameMs = performance.now();

  window.addEventListener('keydown', e => {
    state = handleKeyDown(state, e.key);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => {
    state = handleKeyUp(state, e.key);
  });

  function loop(nowMs) {
    const dtMs = nowMs - lastFrameMs;
    lastFrameMs = nowMs;
    state = { ...state, nowMs };
    state = update(state, dtMs);
    render(ctx, state);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Expose state for E2E tests (read-only inspection)
  if (typeof window !== 'undefined') {
    window.__GAME__ = {
      getPhase: () => state.phase,
      getScore: () => state.score,
      getElapsedSec: () => state.elapsedSec,
    };
  }
}
