import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/search-jobs': {
        target: 'https://rest.arbeitsagentur.de',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const params = url.searchParams
          return `/jobboerse/jobsuche-service/pc/v4/jobs?${params.toString()}`
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-API-Key', 'jobboerse-jobsuche')
            proxyReq.setHeader('Accept', 'application/json')
          })
        },
      },
      '/api/job-details': {
        target: 'https://rest.arbeitsagentur.de',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const refnr = url.searchParams.get('refnr') ?? ''
          const encoded = Buffer.from(refnr, 'utf8').toString('base64')
          return `/jobboerse/jobsuche-service/pc/v4/jobdetails/${encoded}`
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-API-Key', 'jobboerse-jobsuche')
            proxyReq.setHeader('Accept', 'application/json')
          })
        },
      },
    },
  },
})
