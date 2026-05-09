export const LANE_COUNT = 3;
export const DANGER_ZONE_Y = 160;
export const OBSTACLE_W = 30;
export const OBSTACLE_H = 30;
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;
export const BONFIRE_SPAWN_RATE = 0.10;

export function laneToX(lane) {
  if (lane < 0 || lane >= LANE_COUNT) {
    throw new Error(`Lane ${lane} out of range [0, ${LANE_COUNT})`);
  }
  const laneWidth = CANVAS_WIDTH / LANE_COUNT;
  return laneWidth * lane + laneWidth / 2 - OBSTACLE_W / 2;
}

export function pickSafeLane(inFlight, rng = Math.random) {
  const blockedLanes = new Set(
    inFlight.filter(o => o.y < DANGER_ZONE_Y).map(o => o.lane)
  );
  const safeLanes = [];
  for (let lane = 0; lane < LANE_COUNT; lane++) {
    if (!blockedLanes.has(lane)) safeLanes.push(lane);
  }
  // Solvability guarantee: if all lanes blocked (shouldn't happen if invariant
  // is maintained), force-pick the lane farthest from danger zone top.
  if (safeLanes.length === 0) {
    let best = inFlight
      .filter(o => o.y < DANGER_ZONE_Y)
      .reduce((acc, o) => (o.y > acc.y ? o : acc), { y: -Infinity, lane: 0 });
    return best.lane;
  }
  const idx = Math.floor(rng() * safeLanes.length);
  return safeLanes[Math.min(idx, safeLanes.length - 1)];
}

export function createObstacle(lane, type = 'obstacle') {
  return {
    lane,
    type,
    x: laneToX(lane),
    y: -OBSTACLE_H, // start just above canvas
    w: OBSTACLE_W,
    h: OBSTACLE_H,
  };
}

export function isBonfire(o) {
  return o.type === 'bonfire';
}

export function shouldSpawnBonfire(rng = Math.random) {
  return rng() < BONFIRE_SPAWN_RATE;
}
