const PALETTES: [string, string][] = [
  ['#a71930', '#f2a65a'], ['#1f5fa8', '#6ec6ca'], ['#2d6a4f', '#b7e4c7'], ['#6d3b9e', '#f4a6c0'],
  ['#26282b', '#e07a5f'], ['#b5451b', '#f9c74f'], ['#0b7285', '#a5d8ff'], ['#7a1f5c', '#ffb4a2'],
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
