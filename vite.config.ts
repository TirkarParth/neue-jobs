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
        secure: true,
        rewrite: (path) => {
          const queryIndex = path.indexOf('?')
          const query = queryIndex >= 0 ? path.slice(queryIndex) : ''
          return `/jobboerse/jobsuche-service/pc/v4/jobs${query}`
        },
        headers: {
          'X-API-Key': 'jobboerse-jobsuche',
          Accept: 'application/json',
        },
      },
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
})
