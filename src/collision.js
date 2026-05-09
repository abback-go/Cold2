export function isColliding(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function hitsAny(player, obstacles) {
  for (const obs of obstacles) {
    if (isColliding(player, obs)) return obs;
  }
  return null;
}
