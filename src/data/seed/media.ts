// Real photos (Unsplash License, free to use) and royalty-free demo tracks (SoundHelix) for seed posts.
// Remote URLs only: nothing is stored in the repo. If a URL fails, PostCard falls back to generated art.

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

export const MEDIA = {
  broadStreet: [u('photo-1526590916886-c918f193794d')],
  fallCampus: [
    u('photo-1699155759495-855eaf21cfde'), u('photo-1670528148572-9270351b95bd'), u('photo-1638616110725-a0765049a544'),
    u('photo-1669455257486-1156934066db'), u('photo-1762572336330-726cdf5ff954'), u('photo-1792299444661-6902cb29d8dd'),
  ],
  thrift: [
    u('photo-1619161519929-befcb28d6384'), u('photo-1624192647570-1131acc12ccf'), u('photo-1759630814559-f9fffe187384'),
    u('photo-1642359730306-4e80ff12ff6d'), u('photo-1717201395289-03e4700ca8b6'),
  ],
  sunriseRun: [u('photo-1502224562085-639556652f33')],
  zine: [u('photo-1525247663235-1d5a3ae627fd')],
  lighting: [u('photo-1471341971476-ae15ff5dd4ea')],
  gameJam: [u('photo-1640955014216-75201056c829')],
  beatCover: [u('photo-1600861195091-690c92f1d2cc')],
}

export const AUDIO = {
  beat: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  chiptune: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
}

/** Photo covers for some events; the rest keep the generated category artwork. */
const ph = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`
export const EVENT_PHOTOS: Record<string, string> = {
  'ev-today': ph('1724232860199-ca42e61ddb43'),
  'ev-art': ph('1738391788925-d130a4993d50'),
  'ev-mic': ph('1764032760868-dced31a72fb4'),
  'ev-cleanup': ph('1565803974275-dccd2f933cbb'),
  'ev-5k': ph('1570004119777-2b1786b0e5bd'),
  'ev-jazz': ph('1764214918540-4467f7f1f1da'),
  'ev-film': ph('1485095329183-d0797cdc5676'),
  'ev-swap': ph('1540221652346-e5dd6b50f3e7'),
  'ev-gym': ph('1519432473078-0151c4f90335'),
  'ev-past': ph('1568571293333-566f5f278d19'),
}
