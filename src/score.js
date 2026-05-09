export const BONUS_PER_BONFIRE = 5;

export function createScore() {
  return { survivalSec: 0, bonus: 0 };
}

export function addTime(score, deltaSec) {
  if (deltaSec < 0) return score;
  return { ...score, survivalSec: score.survivalSec + deltaSec };
}

export function addBonus(score) {
  return { ...score, bonus: score.bonus + BONUS_PER_BONFIRE };
}

export function formatScore(score) {
  const sec = score.survivalSec.toFixed(1);
  return `생존 ${sec}초 + 보너스 ${score.bonus}`;
}
