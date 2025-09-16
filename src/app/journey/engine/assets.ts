import type { Theme } from "./types";

const cache = new Map<string, HTMLImageElement>();

export function loadImage(src?: string){
  if (!src) return undefined;
  if (cache.has(src)) return cache.get(src)!;
  const img = new Image();
  img.src = src; 
  cache.set(src, img); 
  return img;
}

export function loadThemeImages(theme: Theme){
  theme.images.backgroundLayers?.forEach(l => loadImage(l.src));
  loadImage(theme.images.ground?.src);
  loadImage(theme.images.cactus?.src);
  loadImage(theme.images.bird?.src);
  loadImage(theme.images.player?.src);
  loadImage(theme.images.billboardFrame?.src);   // NEW
}


// Add/replace this helper so TS narrows the type after a check
export function imgReady(img: HTMLImageElement | undefined): img is HTMLImageElement {
  return !!img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
}

