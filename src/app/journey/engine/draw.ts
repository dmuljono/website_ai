import { VIEW, WORLD, PLAYER, BILLBOARDS } from "./constants";
import type { GameState, Theme, Obstacle, Billboard } from "./types";
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

  // Billboards: draw after ground, before player/obstacles
  for (const bb of state.billboards) {
    drawBillboard(ctx, bb, state.camera.x, theme);
  }

  // Obstacles
  for (const ob of state.obstacles) {
    drawObstacle(ctx, ob, state.camera.x, theme);
  }

  // Player
  drawPlayer(ctx, state, theme, debug);

  // HUD & overlays
  drawHUD(ctx, state.paused, state.gameOver, theme);
}

/* -------------------------- Billboards -------------------------- */

function drawBillboard(
  ctx: CanvasRenderingContext2D,
  bb: Billboard,
  camX: number,
  theme: Theme
) {
  const sx = Math.round(bb.x - camX);
  if (sx + bb.w < -50 || sx > VIEW.width + 50) return;

  const yTop = WORLD.groundY + BILLBOARDS.offsetY;
  const postH = bb.h - 10;
  const postY = yTop + 10;

  // posts
  ctx.fillStyle = "#3b2f2f";
  ctx.fillRect(sx + 16, postY, 10, postH);
  ctx.fillRect(sx + bb.w - 26, postY, 10, postH);

  // frame (image or procedural)
  const frame = theme.images.billboardFrame;
  const panelY = yTop;
  if (frame?.src) {
    const img = loadImage(frame.src);
    if (imgReady(img)) {
      const dw = frame.w ?? bb.w;
      const dh = frame.h ?? bb.h;
      ctx.drawImage(img, sx, panelY, dw, dh);
    } else {
      drawPanel(ctx, sx, panelY, bb.w, bb.h);
    }
  } else {
    drawPanel(ctx, sx, panelY, bb.w, bb.h);
  }

  // content
  if (bb.imgSrc) {
    const pic = loadImage(bb.imgSrc);
    if (imgReady(pic)) {
      const pad = 14;
      const dw = bb.w - pad * 2;
      const dh = bb.h - pad * 2;
      ctx.drawImage(pic, sx + pad, panelY + pad, dw, dh);
    }
  } else if (bb.text) {
    const pad = 12;
    ctx.fillStyle = "#111";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    wrapText(ctx, bb.text, sx + pad, panelY + pad + 14, bb.w - pad * 2, 18);
  }
}

function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#f3e4c8";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#5b4636";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  // trims
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(x, y, w, 6);
  ctx.fillRect(x, y + h - 6, w, 6);
}

// lightweight word wrap
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const test = line ? line + " " + words[n] : words[n];
    const w = ctx.measureText(test).width;
    if (w > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n];
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

/* ----------------------- Background & Ground ----------------------- */

function drawBackground(ctx: CanvasRenderingContext2D, camX: number, theme: Theme) {
  // sky fill
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

  // fallback mountains
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
    // procedural ground
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

/* ---------------------------- Obstacles ---------------------------- */

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

/* ----------------------------- Player ------------------------------ */

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

  // shadow
  ctx.fillStyle = theme.colors.dinoShadow;
  ctx.beginPath();
  ctx.ellipse(sx + PLAYER.w / 2, WORLD.groundY + 6, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const sprite = theme.images.player;
  if (sprite?.src) {
    const img = loadImage(sprite.src);
    if (imgReady(img)) {
      // 3-frame sheet: 0=idle, 1-2=run loop
      const speed = Math.abs(p.vx);
      const isRunning = p.grounded && speed > 20;

      const frames = sprite.frames ?? 3;
      const fps = sprite.fps ?? 6;
      const rows = sprite.rows ?? 1;
      const map = sprite.map ?? {};
      let row = 0;
      if (!p.grounded) row = map.jump ?? row;
      else if (p.ducking) row = map.duck ?? row;
      else if (isRunning) row = map.run ?? row;
      else row = map.idle ?? row;
      row = Math.max(0, Math.min(row, rows - 1));

      let frameIndex = 0;
      if (isRunning) {
        const runFrames = [1, 2];
        const idx = Math.floor((p.anim * fps) % runFrames.length);
        frameIndex = runFrames[idx];
      }

      const sw = img.naturalWidth / frames;
      const sh = img.naturalHeight / rows;

      const dw = sprite.w ?? PLAYER.w;
      const dh =
        sprite.h ??
        (p.ducking && !sprite.map?.duck && sprite.duckScale
          ? Math.floor(PLAYER.h * sprite.duckScale)
          : PLAYER.h);

      const sxFrame = frameIndex * sw;
      const syRow = row * sh;

      const goingLeft = p.vx < -10;
      if (goingLeft) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, sxFrame, syRow, sw, sh, -(sx + dw), sy, dw, dh);
        ctx.restore();
      } else {
        ctx.drawImage(img, sxFrame, syRow, sw, sh, sx, sy, dw, dh);
      }
    }
  } else {
    // procedural fallback
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

/* ------------------------------- HUD ------------------------------- */

function drawHUD(
  ctx: CanvasRenderingContext2D,
  paused: boolean,
  over: boolean,
  theme: Theme
) {
  // score (top-right)
  ctx.fillStyle = theme.colors.hud;
  ctx.font = "24px 'Press Start 2P', monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  if (paused && !over) {
    ctx.fillText("PAUSED (P)", 20, 30);
  }

  if (over) {
    // dim everything safely
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    ctx.restore();


    // centered restart message
    const msg = "Press Enter to start over";
    ctx.fillStyle = "#fff";
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(msg, VIEW.width / 2, VIEW.height / 2);
  }
}

/* ----------------------------- Utility ---------------------------- */

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
