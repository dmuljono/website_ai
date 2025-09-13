import { VIEW, WORLD, PLAYER } from "./constants";
import type { GameState, Theme, Obstacle } from "./types";
import { loadImage, imgReady } from "./assets";

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  theme: Theme,
  debug = false
) {
  ctx.imageSmoothingEnabled = !theme.pixelArt;
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);

  drawBackground(ctx, state.camera.x, theme);
  drawGround(ctx, state.camera.x, theme);

  for (const ob of state.obstacles) {
    drawObstacle(ctx, ob, state.camera.x, theme);
  }

  drawPlayer(ctx, state, theme, debug);
  drawHUD(ctx, Math.floor(state.score), 0, state.paused, state.gameOver, theme);
}

function drawBackground(ctx: CanvasRenderingContext2D, camX: number, theme: Theme) {
  ctx.fillStyle = theme.colors.sky;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);

  const layers = theme.images.backgroundLayers ?? [];
  for (const layer of layers) {
    const img = loadImage(layer.src);
    if (!imgReady(img)) continue;

    const srcW = img.naturalWidth;
    const fullH = img.naturalHeight;

    const rawSrcH = layer.srcH ?? fullH;
    const srcH = Math.max(1, Math.min(rawSrcH, fullH));
    const rawSrcY = layer.srcY ?? (fullH - srcH);
    const srcY = Math.max(0, Math.min(rawSrcY, fullH - srcH));

    const drawH = layer.height ?? srcH;
    const y = layer.topY ?? (WORLD.groundY - drawH - 40);
    const tileW = srcW;

    const parX = -camX * (layer.speed ?? 0.5);
    let start = Math.floor(parX % tileW) - tileW;

    for (let x = start; x < VIEW.width + tileW; x += tileW) {
      ctx.drawImage(img, 0, srcY, srcW, srcH, x, y, srcW, drawH);
    }
  }

  if (layers.length === 0) {
    ctx.fillStyle = theme.colors.mountain;
    const baseY = WORLD.groundY - 80;
    for (let i = -1; i < 8; i++) {
      const mx = Math.floor((-camX * 0.2 + i * 240) % (VIEW.width + 240));
      triangle(ctx, mx, baseY, mx + 80, baseY - 40, mx + 160, baseY);
    }
  }
}

function drawGround(ctx: CanvasRenderingContext2D, camX: number, theme: Theme) {
  const g = theme.images.ground;
  if (g?.src) {
    const img = loadImage(g.src);
    if (!imgReady(img)) return;

    const srcW = img.naturalWidth;
    const fullH = img.naturalHeight;

    const rawSrcH = g.srcH ?? fullH;
    const srcH = Math.max(1, Math.min(rawSrcH, fullH));
    const rawSrcY = g.srcY ?? (fullH - srcH);
    const srcY = Math.max(0, Math.min(rawSrcY, fullH - srcH));

    const drawH = g.height ?? srcH;
    const y = g.topY ?? WORLD.groundY;
    const tileW = srcW;

    let start = -Math.floor((camX % tileW) + tileW);
    for (let x = start; x < VIEW.width + tileW; x += tileW) {
      ctx.drawImage(img, 0, srcY, srcW, srcH, x, y, srcW, drawH);
    }
  } else {
    ctx.fillStyle = theme.colors.groundTop;
    ctx.fillRect(0, WORLD.groundY, VIEW.width, VIEW.height - WORLD.groundY);
    ctx.strokeStyle = theme.colors.groundStripe;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(-((camX * 1.2) % 20), WORLD.groundY + 18);
    ctx.lineTo(VIEW.width, WORLD.groundY + 18);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawObstacle(
  ctx: CanvasRenderingContext2D,
  ob: Obstacle,
  camX: number,
  theme: Theme
) {
  const sx = Math.round(ob.x - camX);
  if (sx + ob.w < -50 || sx > VIEW.width + 50) return;

  if (ob.type === "cactus") {
    const c = theme.images.cactus;
    if (c?.src) {
      const img = loadImage(c.src);
      const w = c.w ?? ob.w;
      const h = c.h ?? ob.h;
      if (imgReady(img)) ctx.drawImage(img, sx, ob.y + (ob.h - h), w, h);
    } else {
      ctx.fillStyle = theme.colors.cactus;
      ctx.fillRect(sx, ob.y, ob.w, ob.h);
      ctx.fillRect(sx - 8, ob.y + 10, 6, Math.max(12, ob.h - 28));
      ctx.fillRect(sx + ob.w + 2, ob.y + 18, 6, Math.max(10, ob.h - 36));
    }
  } else {
    const b = theme.images.bird;
    if (b?.src) {
      const img = loadImage(b.src);
      const w = b.w ?? ob.w;
      const h = b.h ?? ob.h;
      if (imgReady(img)) ctx.drawImage(img, sx, ob.y, w, h);
    } else {
      ctx.fillStyle = theme.colors.bird;
      ctx.fillRect(sx, ob.y, ob.w, ob.h);
      const fl = Math.sin((ob.id * 13 + performance.now() / 80)) > 0 ? 8 : -8;
      ctx.fillRect(sx - 10, ob.y + 8 + fl, 18, 4);
      ctx.fillRect(sx + ob.w - 8, ob.y + 8 - fl, 18, 4);
    }
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  theme: Theme,
  dbg: boolean
) {
  const p = state.player;
  const ph = p.ducking ? Math.floor(PLAYER.h * 0.6) : PLAYER.h;
  const sx = Math.round(p.x - state.camera.x);
  const sy = Math.round(p.y + (PLAYER.h - ph));

  ctx.fillStyle = theme.colors.dinoShadow;
  ctx.beginPath();
  ctx.ellipse(sx + PLAYER.w / 2, WORLD.groundY + 6, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const sprite = theme.images.player;
  if (sprite?.src) {
    const img = loadImage(sprite.src);
    if (imgReady(img)) {
      const frames = sprite.frames ?? 1;
      const fps = sprite.fps ?? 10;
      const frameIndex = Math.floor((p.anim * fps) % frames);
      const sw = (img.naturalWidth ?? PLAYER.w) / frames;
      const sh = img.naturalHeight ?? ph;
      const dw = sprite.w ?? PLAYER.w;
      const dh = sprite.h ?? ph;
      if (sw > 0) {
        ctx.drawImage(img, frameIndex * sw, 0, sw, sh, sx, sy, dw, dh);
      }
    }
  } else {
    ctx.fillStyle = theme.colors.dinoBody;
    ctx.fillRect(sx + 6, sy, PLAYER.w - 12, ph - 6);
    ctx.fillRect(sx + 12, sy - 16, 22, 16);
    ctx.fillStyle = theme.colors.sky;
    ctx.fillRect(sx + 30, sy - 10, 2, 2);
    const step = Math.sin(p.anim * 10);
    ctx.fillStyle = theme.colors.dinoBody;
    ctx.fillRect(sx + 10, sy + ph - 8 + (p.grounded ? step * 2 : 0), 10, 8);
    ctx.fillRect(sx + 24, sy + ph - 8 + (p.grounded ? -step * 2 : 0), 10, 8);
  }

  if (dbg) {
    ctx.strokeStyle = "red";
    ctx.strokeRect(sx, sy, PLAYER.w, ph);
  }
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  hi: number,
  paused: boolean,
  over: boolean,
  theme: Theme
) {
  ctx.fillStyle = theme.colors.hud;
  ctx.font = "16px monospace";
  const s = score.toString().padStart(5, "0");
  const h = hi.toString().padStart(5, "0");
  ctx.fillText(`HI ${h}   ${s}`, VIEW.width - 220, 30);
  if (paused) ctx.fillText("PAUSED (P)", 20, 30);
  if (over) {
    ctx.font = "20px monospace";
    ctx.fillText("GAME OVER — Press Enter", VIEW.width / 2 - 150, 100);
  }
}

function triangle(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}
