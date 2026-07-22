import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  aggregateJobs,
  credentialsFromEnv,
  type AggregateSearchParams,
  type JobSource,
} from './netlify/functions/lib/aggregate'

function multiSourceApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'nahjobs-multi-source-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/search-jobs')) {
          next()
          return
        }

        try {
          const url = new URL(req.url, 'http://localhost')
          const params: AggregateSearchParams = {
            was: url.searchParams.get('was') || undefined,
            wo: url.searchParams.get('wo') || undefined,
            umkreis: toNumber(url.searchParams.get('umkreis')),
            page: toNumber(url.searchParams.get('page')) ?? 1,
            size: toNumber(url.searchParams.get('size')) ?? 20,
            angebotsart: toNumber(url.searchParams.get('angebotsart')),
            arbeitszeit: url.searchParams.get('arbeitszeit') || undefined,
            befristung: toNumber(url.searchParams.get('befristung')),
            veroeffentlichtseit: toNumber(url.searchParams.get('veroeffentlichtseit')),
            sources: parseSources(url.searchParams.get('sources')),
          }

          const body = await aggregateJobs(params, credentialsFromEnv(env))
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        } catch (error) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Aggregation failed',
            }),
          )
        }
      })
    },
  }
}

function toNumber(value: string | null): number | undefined {
  if (value == null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseSources(value: string | null): JobSource[] | undefined {
  if (!value) return undefined
  return value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean) as JobSource[]
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), multiSourceApiPlugin(env)],
    server: {
      proxy: {
        '/api/job-details': {
          target: 'https://rest.arbeitsagentur.de',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost')
            const refnr = url.searchParams.get('refnr') ?? ''
            const encoded = Buffer.from(refnr, 'utf8').toString('base64')
            return `/jobboerse/jobsuche-service/pc/v4/jobdetails/${encoded}`
          },
          headers: {
            'X-API-Key': 'jobboerse-jobsuche',
            Accept: 'application/json',
          },
        },
      },
    },
  }
})
