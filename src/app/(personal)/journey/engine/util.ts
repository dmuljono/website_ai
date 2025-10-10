export function aabb(ax:number, ay:number, aw:number, ah:number, bx:number, by:number, bw:number, bh:number){
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function mulberry32(seed: number){
  return function(){
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
