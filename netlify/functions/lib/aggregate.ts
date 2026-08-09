import { searchAdzuna } from './providers/adzuna'
import { searchArbeitsagentur } from './providers/arbeitsagentur'
import { searchJooble } from './providers/jooble'
import { hasSuccessfulSource, summarizeSourceFailures } from './source-status'
import {
  ALL_SOURCES,
  SOURCE_LABELS,
  type AggregateSearchParams,
  type AggregateSearchResponse,
  type JobSource,
  type NormalizedJob,
  type ProviderCredentials,
  type ProviderResult,
} from './types'

function dedupeKey(job: NormalizedJob): string {
  return [job.title, job.company, job.locationLabel]
    .map((part) => (part ?? '').toLowerCase().replace(/\s+/g, ' ').trim())
    .join('|')
}

function dedupeJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Set<string>()
  const unique: NormalizedJob[] = []

  for (const job of jobs) {
    const key = dedupeKey(job)
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(job)
  }

  return unique
}

function sortJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  return [...jobs].sort((a, b) => {
    const da = a.distanceKm
    const db = b.distanceKm
    if (da != null && db != null && da !== db) return da - db
    if (da != null && db == null) return -1
    if (da == null && db != null) return 1

    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return tb - ta
  })
}

function parseSources(raw?: string | JobSource[]): JobSource[] {
  if (!raw) return [...ALL_SOURCES]
  const list = Array.isArray(raw) ? raw : raw.split(',')
  const selected = list
    .map((value) => value.trim().toLowerCase())
    .filter((value): value is JobSource =>
      (ALL_SOURCES as readonly string[]).includes(value),
    )
  return selected.length > 0 ? selected : [...ALL_SOURCES]
}

export async function aggregateJobs(
  params: AggregateSearchParams,
  credentials: ProviderCredentials,
): Promise<AggregateSearchResponse> {
  const page = params.page ?? 1
  const size = params.size ?? 20
  const selected = parseSources(params.sources)

  // Probe credentials so we only split page size across sources that can run.
  const runnable = selected.filter((source) => {
    if (source === 'arbeitsagentur') return true
    if (source === 'adzuna') {
      return Boolean(credentials.adzunaAppId && credentials.adzunaAppKey)
    }
    return Boolean(credentials.joobleApiKey)
  })
  const divisor = Math.max(1, runnable.length)
  const perSourceSize = Math.max(5, Math.ceil(size / divisor))

  const searchParams: AggregateSearchParams = {
    ...params,
    page,
    size: perSourceSize,
  }

  const tasks: Promise<ProviderResult>[] = selected.map((source) => {
    if (source === 'arbeitsagentur') return searchArbeitsagentur(searchParams)
    if (source === 'adzuna') return searchAdzuna(searchParams, credentials)
    return searchJooble(searchParams, credentials)
  })

  const results = await Promise.all(tasks)
  const sources = results.map((result) => ({
    id: result.source,
    label: result.label || SOURCE_LABELS[result.source],
    status: result.status,
    total: result.total,
    message: result.message,
  }))

  const merged = sortJobs(dedupeJobs(results.flatMap((result) => result.jobs))).slice(
    0,
    size,
  )

  const total = results.reduce((sum, result) => sum + (result.total || 0), 0)
  const warning =
    merged.length === 0 && !hasSuccessfulSource(sources)
      ? summarizeSourceFailures(sources)
      : undefined

  return {
    jobs: merged,
    total,
    page,
    size,
    sources,
    warning,
  }
}

export function credentialsFromEnv(
  env: Record<string, string | undefined> = process.env,
): ProviderCredentials {
  return {
    adzunaAppId: env.ADZUNA_APP_ID || env.VITE_ADZUNA_APP_ID,
    adzunaAppKey: env.ADZUNA_APP_KEY || env.VITE_ADZUNA_APP_KEY,
    joobleApiKey: env.JOOBLE_API_KEY || env.VITE_JOOBLE_API_KEY,
  }
}

export type { AggregateSearchParams, AggregateSearchResponse, JobSource }
export { ALL_SOURCES, SOURCE_LABELS }
