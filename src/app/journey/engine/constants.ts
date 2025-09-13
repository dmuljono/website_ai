export const VIEW = { width: 1000, height: 360 } as const;

export const WORLD = {
  gravity: 3000,
  groundY: 270,
  baseSpeed: 220,
  maxRunSpeed: 360,
  accel: 3000,
  friction: 0.85,
  jumpVel: 980,
  maxFallSpeed: 1800,
  coyoteTime: 0.1,
  jumpBuffer: 0.12,
} as const;

export const PLAYER = { w: 44, h: 48 } as const;
