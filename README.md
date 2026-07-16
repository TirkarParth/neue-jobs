# NahJobs

Find jobs near you in Germany. Built with Vue 3 and deployed on Netlify.

## Feasibility research

| Question | Answer |
| --- | --- |
| Vue.js on Netlify? | Yes. Static SPA build (`npm run build` → `dist`) with SPA rewrite to `index.html`. |
| Jobs in Germany by location? | Yes. Bundesagentur für Arbeit Jobsuche API supports `wo` (place) + `umkreis` (radius in km) and returns distance + coordinates. |
| Official alternative | [Adzuna](https://developer.adzuna.com/) country code `de` (requires free `app_id` / `app_key`). |

Primary data source: the community-documented [Arbeitsagentur Jobsuche API](https://github.com/bundesAPI/jobsuche-api) (`rest.arbeitsagentur.de`), proxied through Netlify Functions (production) and a Vite proxy (local `npm run dev`).

## Features

- Keyword + city / PLZ search across Germany
- “Mein Standort” via browser geolocation + Nominatim reverse geocoding
- Radius filter (5–200 km)
- Filters for Angebotsart and Arbeitszeit
- German UI optimized for nearby results

## Stack

- Vue 3 + TypeScript + Vite
- Vue Router
- Netlify (static hosting + serverless functions)

## Local development

Requires Node 20.19+ (Node 22 recommended via `.nvmrc`):

```bash
nvm use
npm install
npm run dev
```

Open http://localhost:5173

For Netlify Functions locally:

```bash
npx netlify dev
```

## Deploy on Netlify

1. Push this repo to GitHub
2. In Netlify: **Add new site → Import from Git**
3. Build settings are already in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions: `netlify/functions`
4. Deploy — every push to `main` rebuilds the site

## Project layout

```
src/                 Vue app (views, components, API client)
netlify/functions/   search-jobs + job-details proxies
netlify.toml         build + SPA + /api rewrites
```

## License

MIT
