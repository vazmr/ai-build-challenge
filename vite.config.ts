import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { handleAssistant } from './api/_assistant.ts'

/** Serves POST /api/assistant in dev, reading ANTHROPIC_API_KEY from .env.local (server side only). */
function assistantDevApi(apiKey: string | undefined): Plugin {
  return {
    name: 'assistant-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/assistant', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let data = ''
        req.on('data', (c) => { data += c; if (data.length > 200_000) req.destroy() })
        req.on('end', async () => {
          let parsed: unknown
          try { parsed = JSON.parse(data) } catch { parsed = undefined }
          const out = await handleAssistant(parsed, apiKey)
          res.statusCode = out.status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(out.body))
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), tailwindcss(), assistantDevApi(env.ANTHROPIC_API_KEY)] }
})
