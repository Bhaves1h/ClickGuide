import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function backendApiPlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), 'data')
  const waitlistFile = path.join(dataDir, 'waitlist.json')

  function ensureStorage() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(waitlistFile)) {
      fs.writeFileSync(waitlistFile, JSON.stringify({ entries: [] }, null, 2), 'utf-8')
    }
  }

  function readWaitlist(): { entries: any[] } {
    ensureStorage()
    try {
      const content = fs.readFileSync(waitlistFile, 'utf-8')
      return JSON.parse(content)
    } catch {
      return { entries: [] }
    }
  }

  function saveWaitlist(data: { entries: any[] }) {
    ensureStorage()
    fs.writeFileSync(waitlistFile, JSON.stringify(data, null, 2), 'utf-8')
  }

  return {
    name: 'clickguide-backend-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]

        if (url === '/api/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.statusCode = 200
          res.end(JSON.stringify({ status: 'ok', service: 'clickguide-backend', version: '2.0.0' }))
          return
        }

        if (url === '/api/waitlist') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }

          if (req.method === 'GET') {
            const data = readWaitlist()
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ success: true, total: data.entries.length, entries: data.entries }))
            return
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body || '{}')
                const email = (parsed.email || '').trim().toLowerCase()
                const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

                if (!email || !EMAIL_REGEX.test(email)) {
                  res.setHeader('Content-Type', 'application/json')
                  res.statusCode = 400
                  res.end(JSON.stringify({ success: false, error: 'Invalid email address' }))
                  return
                }

                const data = readWaitlist()
                const sanitizedId = email.replace(/[\/\s]/g, '_')
                const existingIndex = data.entries.findIndex((e: any) => e.sanitizedId === sanitizedId)

                const newEntry = {
                  sanitizedId,
                  email,
                  name: parsed.name || '',
                  userType: parsed.userType || 'general',
                  source: parsed.source || 'landing',
                  createdAt: new Date().toISOString(),
                }

                if (existingIndex >= 0) {
                  data.entries[existingIndex] = newEntry
                } else {
                  data.entries.unshift(newEntry)
                }

                saveWaitlist(data)

                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, message: 'Successfully joined waitlist', entry: newEntry }))
              } catch (e: any) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 500
                res.end(JSON.stringify({ success: false, error: e.message || 'Server error' }))
              }
            })
            return
          }
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  server: {
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
})
