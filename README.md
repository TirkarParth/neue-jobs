# NahJobs

Find jobs near you in Germany. Built with Vue 3 and deployed on Netlify.

## Feasibility research

| Question | Answer |
| --- | --- |
| Vue.js on Netlify? | Yes. Static SPA build (`npm run build` → `dist`) with SPA rewrite to `index.html`. |
| Jobs in Germany by location? | Yes. Bundesagentur für Arbeit Jobsuche API supports `wo` (place) + `umkreis` (radius in km) and returns distance + coordinates. |
| Official alternative | [Adzuna](https://developer.adzuna.com/) country code `de` (requires free `app_id` / `app_key`). |

Primary data source for this app: the community-documented [Arbeitsagentur Jobsuche API](https://github.com/bundesAPI/jobsuche-api) (`rest.arbeitsagentur.de`), proxied through Netlify Functions to avoid CORS and keep the client thin.

## Stack

- Vue 3 + TypeScript + Vite
- Vue Router
- Netlify (static hosting + serverless functions)

## Local development

```bash
nvm use   # Node 22
npm install
npm run dev
```

For functions locally, use [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
npx netlify dev
```

## Deploy on Netlify

1. Push this repo to GitHub
2. In Netlify: **Add new site → Import from Git**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. (Optional) Node version is set in `netlify.toml`

## License

MIT
