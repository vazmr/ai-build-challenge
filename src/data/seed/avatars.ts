// Portrait photos (Unsplash License) for the fictional demo students, keyed by display name.
// Names without an entry (organizations, new users) keep the initial-letter avatar.
const p = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=160&h=160&q=75`

export const AVATARS: Record<string, string> = {
  Jordan: p('1611695434369-a8f5d76ceb7b'),
  Taylor: p('1741354035032-eff737bfd35c'),
  Morgan: p('1757744705465-ea08b0ddc38a'),
  Alex: p('1525457136159-8878648a7ad0'),
  Riley: p('1604177091072-b7b677a077f6'),
  Sam: p('1546525848-3ce03ca516f6'),
  Casey: p('1607990283143-e81e7a2c9349'),
  Devon: p('1566753323558-f4e0952af115'),
  Priya: p('1662850886700-4ec19bd30d11'),
  Marcus: p('1624918479892-3e5df2910410'),
}
