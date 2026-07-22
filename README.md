# NahJobs

Find jobs near you in Germany across multiple boards. Built with Vue 3 and deployed on Netlify.

## Repository

https://github.com/TirkarParth/neue-jobs

## Sources

| Source | Needs API key? | Notes |
| --- | --- | --- |
| **Arbeitsagentur** | No | Always on — largest public German jobs DB |
| **Adzuna** | Yes (`ADZUNA_APP_ID`, `ADZUNA_APP_KEY`) | Free developer keys, country `de` |
| **Jooble** | Yes (`JOOBLE_API_KEY`) | Free key via Jooble API signup |

LinkedIn / Indeed / Google Jobs are **not** included — they don’t offer a public search API for third-party apps.

Without Adzuna/Jooble keys, those sources are skipped gracefully and Arbeitsagentur still works.

## Local development

Requires Node 20.19+ (Node 22 recommended via `.nvmrc`):

```bash
nvm use
cp .env.example .env   # optional: add Adzuna + Jooble keys
npm install
npm run dev
```

Open http://localhost:5173

Local `/api/search-jobs` is served by a Vite middleware that aggregates all sources.

## Deploy on Netlify

1. Open [Netlify → Import an existing project](https://app.netlify.com/start)
2. Choose GitHub and select `TirkarParth/neue-jobs`
3. Build settings are in `netlify.toml`
4. Add env vars in **Site settings → Environment variables**:
   - `ADZUNA_APP_ID`
   - `ADZUNA_APP_KEY`
   - `JOOBLE_API_KEY`
5. Deploy

## Project layout

```
src/                       Vue app
netlify/functions/         search-jobs aggregator + providers
netlify/functions/lib/     shared aggregation logic
.net.example               API key template
```

## License

MIT
