/** Parse "a, b, c" into a de-duplicated, trimmed list. */
export const parseList = (raw: string) => [...new Set(raw.split(',').map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean))]
