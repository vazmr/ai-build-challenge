import { handleAssistant } from './_assistant.ts'

// Vercel serverless function: POST /api/assistant
export default async function handler(req: { method?: string; body?: unknown }, res: { status: (n: number) => { json: (b: unknown) => void } }) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const out = await handleAssistant(req.body, process.env.ANTHROPIC_API_KEY)
  return res.status(out.status).json(out.body)
}
