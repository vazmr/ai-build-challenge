// Tone-on-tone pairs in the Temple cherry family plus a few deep supporting hues.
// Both stops keep >= 5:1 contrast with white, so white text on any generated
// surface (avatars, labels over placeholder art) stays readable.
const PALETTES: [string, string][] = [
  ['#a71930', '#7d1124'], // cherry
  ['#7a1f3d', '#4d1226'], // burgundy
  ['#b5451b', '#8a2f0e'], // ember
  ['#8a5a00', '#5f3d00'], // ochre
  ['#1d6b43', '#124a2e'], // forest
  ['#9c3d2e', '#6e2518'], // brick
  ['#1f4f8a', '#163a68'], // slate blue
  ['#8c1428', '#5a0c19'], // deep cherry
]

export function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export const paletteFor = (seed: string) => PALETTES[hashStr(seed) % PALETTES.length]
export const gradientFor = (seed: string, angle = 135) => {
  const [a, b] = paletteFor(seed)
  return `linear-gradient(${angle}deg, ${a}, ${b})`
}
