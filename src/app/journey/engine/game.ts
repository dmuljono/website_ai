import { WORLD, VIEW, PLAYER } from "./constants";
import { aabb, mulberry32 } from "./util";
import type { GameState } from "./types";

export function createInitialState(): GameState {
  return {
    player: {
      x: 50,
      y: WORLD.groundY - PLAYER.h,
      vx: 0,
      vy: 0,
      grounded: true,
      ducking: false,
      coyote: 0,
      jumpBuf: 0,
      anim: 0,
    },
    camera: { x: 0 },
    obstacles: [],
    nextSpawnX: 400,
    rng: mulberry32(Math.floor(Math.random() * 1e9)),
    score: 0,
    paused: false,
    gameOver: false,
  };
}

export function stepUpdate(
  state: GameState,
  keys: Record<string, boolean>,
  dt: number,
  onScore: (s: number) => void,
  onOver: (over: boolean) => void
) {
  const p = state.player;
  const cam = state.camera;
  let obstacles = state.obstacles;

  const left = keys["ArrowLeft"] || keys["KeyA"] || (window as any)._leftHeld;
  const right = keys["ArrowRight"] || keys["KeyD"] || (window as any)._rightHeld;
  const up = keys["ArrowUp"] || keys["Space"] || (window as any)._jumpHeld;
  const down = keys["ArrowDown"] || keys["KeyS"] || (window as any)._duckHeld;

  // duck only on ground
  p.ducking = Boolean(down && p.grounded);

  // horizontal movement
  if (!left && !right) {
    p.vx *= WORLD.friction;
  } else {
    const targetVx = (right ? WORLD.maxRunSpeed : 0) - (left ? WORLD.maxRunSpeed : 0);
    const sign = Math.sign(targetVx - p.vx);
    p.vx += sign * WORLD.accel * dt;
  }
  p.vx = Math.max(-WORLD.maxRunSpeed, Math.min(WORLD.maxRunSpeed, p.vx));

  // jumping helpers
  p.jumpBuf = up ? WORLD.jumpBuffer : Math.max(0, p.jumpBuf - dt);
  p.coyote = p.grounded ? WORLD.coyoteTime : Math.max(0, p.coyote - dt);

  // variable jump height
  if (!up && p.vy < 0) p.vy *= 0.55;

  // consume jump
  if (p.jumpBuf > 0 && p.coyote > 0) {
    p.vy = -WORLD.jumpVel;
    p.grounded = false;
    p.coyote = 0;
    p.jumpBuf = 0;
  }

  // gravity
  p.vy = Math.min(WORLD.maxFallSpeed, p.vy + WORLD.gravity * dt);

  // integrate
  let nextX = p.x + p.vx * dt;
  let nextY = p.y + p.vy * dt;

  // flat ground collision
  const ph = p.ducking ? Math.floor(PLAYER.h * 0.6) : PLAYER.h;
  if (nextY + ph >= WORLD.groundY) {
    nextY = WORLD.groundY - ph;
    p.vy = 0;
    p.grounded = true;
  } else {
    p.grounded = false;
  }

  // obstacle collisions (only near view)
  const viewMin = cam.x - 100;
  const viewMax = cam.x + VIEW.width + 300;
  for (const ob of obstacles) {
    if (ob.x + ob.w < viewMin || ob.x > viewMax) continue;
    if (aabb(nextX, nextY, PLAYER.w, ph, ob.x, ob.y, ob.w, ob.h)) {
      onOver(true);
      return;
    }
  }

  // commit position
  p.x = nextX;
  p.y = nextY;

  // camera & auto-scroll
  const autoScroll = WORLD.baseSpeed * dt;
  cam.x += autoScroll;
  const desired = p.x - VIEW.width * 0.35;
  cam.x += (desired - cam.x) * 0.08;
  if (cam.x < 0) cam.x = 0;

  // spawn ahead
  const spawnFront = cam.x + VIEW.width + 400;
  while (state.nextSpawnX < spawnFront) {
    const gap = 160 + Math.floor(state.rng() * 200);
    state.nextSpawnX += gap;

    const t = state.rng();
    if (t < 0.8) {
      // cactus cluster
      const cH = 36 + Math.floor(state.rng() * 34);
      const count = t < 0.4 ? 1 : t < 0.65 ? 2 : 3;
      const startX = state.nextSpawnX + Math.floor(state.rng() * 70);
      for (let i = 0; i < count; i++) {
        obstacles.push({
          id: state.rng() * 1e9 | 0,
          x: startX + i * 32,
          w: 18,
          h: cH,
          type: "cactus",
          y: WORLD.groundY - cH,
        });
      }
    } else {
      // bird
      const hBand = [WORLD.groundY - 110, WORLD.groundY - 160, WORLD.groundY - 70];
      const by = hBand[Math.floor(state.rng() * hBand.length)];
      obstacles.push({
        id: state.rng() * 1e9 | 0,
        x: state.nextSpawnX,
        w: 40,
        h: 24,
        y: by,
        type: "bird",
        vy: state.rng() < 0.5 ? 40 : -40,
      });
    }

    state.nextSpawnX += 80 + Math.floor(state.rng() * 120);
  }

  // update birds
  for (const ob of obstacles) {
    if (ob.type === "bird" && ob.vy) {
      ob.y += ob.vy * dt;
      if (ob.y < WORLD.groundY - 200 || ob.y > WORLD.groundY - 60) {
        ob.vy *= -1;
      }
    }
  }

  // cull behind
  const cullX = cam.x - 600;
  state.obstacles = obstacles = obstacles.filter((o) => o.x + o.w > cullX);

  // score: furthest right reached
  const prevMax = (p as any)._maxX ?? p.x;
  if (p.x > prevMax) {
    (p as any)._maxX = p.x;
    state.score += (p.x - prevMax) / 4;
    onScore(Math.floor(state.score));
  }

  // anim clock
  p.anim += dt * (p.grounded ? (Math.abs(p.vx) + WORLD.baseSpeed) / 180 : 6);
}