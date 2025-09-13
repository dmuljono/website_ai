export type Obstacle = { id: number; x: number; w: number; h: number; type: "cactus"|"bird"; y: number; vy?: number };
export type Player = { x:number; y:number; vx:number; vy:number; grounded:boolean; ducking:boolean; coyote:number; jumpBuf:number; anim:number };
export type Camera = { x:number };
export type BgLayer = {
  src: string;
  speed?: number;
  height?: number;  // optional scale height
  topY?: number;    // Y position on canvas
  srcY?: number;    // source crop start
  srcH?: number;    // source crop height
};

export type ImgGround = {
  src: string;
  /** Destination top Y (where to place the strip on screen). */
  topY?: number;
  /** Force a draw height (scales if set). If omitted, uses naturalHeight or srcH. */
  height?: number;
  /** Source crop from the PNG (optional). */
  srcY?: number;   // starting row in pixels (default: bottom strip)
  srcH?: number;   // how many pixels tall to copy
};

export type ImgWH = { src: string; w?: number; h?: number };
export type ImgPlayer = { src: string; w?: number; h?: number; frames?: number; fps?: number; duckScale?: number };
export type Theme = {
  pixelArt: boolean;
  colors: { sky:string; mountain:string; groundTop:string; groundStripe:string; dinoBody:string; dinoShadow:string; cactus:string; bird:string; hud:string };
  images: { backgroundLayers?: BgLayer[]; ground?: ImgGround; cactus?: ImgWH; bird?: ImgWH; player?: ImgPlayer };
};
export type GameState = { player: Player; camera: Camera; obstacles: Obstacle[]; nextSpawnX:number; rng: ()=>number; score:number; paused:boolean; gameOver:boolean };
