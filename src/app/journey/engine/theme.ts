import type { Theme } from "./types";

const THEME: Theme = {
  pixelArt: true,
  colors: {
    sky: "#0b0e1a",
    mountain: "#12162b",
    groundTop: "#2b2f45",
    groundStripe: "#3a3f5c",
    dinoBody: "#e5e7eb",
    dinoShadow: "rgba(0,0,0,0.2)",
    cactus: "#a7f3d0",
    bird: "#eab308",
    hud: "#e5e7eb",
  },
  images: {
    // 🔹 Parallax background layers (placeholders for now)
      backgroundLayers: [
        { src: "/journey/bg_far.png", speed: 0.2, srcH: 400, topY: 0 },   // horizon
        { src: "/journey/bg_mid.png", speed: 0.4, srcH: 600, topY: 0, height: 400 },  // mid hills
        { src: "/journey/bg_near.png", speed: 0.6, srcH: 500, topY: 120, height: 200 }, // closer ridge
      ],

    // 🔹 Ground strip
    ground: {
      src: "/journey/ground.png",
      srcH: 220,   // crop: bottom 220px of PNG
      topY: 250,   // Y-position on canvas
      height: 180, // draw height (omit to use natural)
    },

    billboardFrame: { src: "/journey/billboard_frame.png", w: 280, h: 120 }, // optional

    // 🔹 Obstacles
    cactus: { src: "/journey/cactus.png", w: 28, h: 56 },
    bird:   { src: "/journey/bird.png", w: 40, h: 24 },

    // 🔹 Player sprite
    // src/app/journey/engine/theme.ts
    player: {
      src: "/journey/player.png",
      w: 44,   // set to your per-frame width in pixels
      h: 56,   // set to your per-frame height in pixels
      frames: 3,
      fps: 1.5
    },
  },
};

export default THEME;
