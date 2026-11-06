export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`
export const nowIso = () => new Date().toISOString()
