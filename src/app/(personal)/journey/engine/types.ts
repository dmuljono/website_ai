// src/app/journey/engine/types.ts

export type Obstacle = {
  id: number;
  x: number;
  w: number;
  h: number;
  type: "cactus" | "bird";
  y: number;
  vy?: number;
};

export type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  grounded: boolean;
  ducking: boolean;
  coyote: number;
  jumpBuf: number;
  anim: number;
};

export type Camera = { x: number };

// Background layer with optional crop/placement/scale
export type BgLayer = {
  src: string;
  speed?: number;
  topY?: number;
  height?: number;   // destination height (scale). Omit for natural.
  srcY?: number;     // crop start (source)
  srcH?: number;     // crop height (source)
  scale?: number;    // (optional) uniform scale for both width & height
};

// Ground image with crop/placement
export type ImgGround = {
  src: string;
  topY?: number;
  height?: number;   // destination height (scale). Omit for natural/srcH.
  srcY?: number;     // crop start (source)
  srcH?: number;     // crop height (source)
};

// Simple image with optional target size
export type ImgWH = { src: string; w?: number; h?: number };

// Player spritesheet
export type ImgPlayer = {
  src: string;
  w?: number;
  h?: number;
  frames?: number;   // columns (frames in a row)
  fps?: number;
  rows?: number;     // optional rows
  map?: { idle?: number; run?: number; duck?: number; jump?: number }; // row map
  duckScale?: number;
};

// Billboards that tell your story
export type Billboard = {
  id: number;
  x: number;         // world X position
  w: number;
  h: number;
  text?: string;
  imgSrc?: string;
};

export type Theme = {
  pixelArt: boolean;
  colors: {
    sky: string;
    mountain: string;
    groundTop: string;
    groundStripe: string;
    dinoBody: string;
    dinoShadow: string;
    cactus: string;
    bird: string;
    hud: string;
  };
  images: {
    backgroundLayers?: BgLayer[];
    ground?: ImgGround;
    cactus?: ImgWH;
    bird?: ImgWH;
    player?: ImgPlayer;
    billboardFrame?: { src: string; w?: number; h?: number };
  };
};

// ✅ Game state now includes BOTH spawners and billboards
export type GameState = {
  player: Player;
  camera: Camera;
  obstacles: Obstacle[];
  nextSpawnX: number;          // for obstacles
  billboards: Billboard[];     // for story panels
  nextBillboardX: number;      // next billboard spawn X
  storyIndex: number;          // which chapter to place next
  rng: () => number;
  paused: boolean;
  gameOver: boolean;
};
