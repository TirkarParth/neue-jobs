import type {
  AggregateSearchParams,
  NormalizedJob,
  ProviderCredentials,
  ProviderResult,
} from '../types'

const JOOBLE_RADII = [0, 4, 8, 16, 26, 40, 80] as const

interface JoobleJob {
  id?: string | number
  title?: string
  location?: string
  snippet?: string
  salary?: string
  source?: string
  type?: string
  link?: string
  company?: string
  updated?: string
}

interface JoobleResponse {
  totalCount?: number
  jobs?: JoobleJob[]
}

function nearestJoobleRadius(km?: number): string {
  if (km == null) return '40'
  let best: (typeof JOOBLE_RADII)[number] = JOOBLE_RADII[0]
  let bestDiff = Math.abs(km - best)
  for (const value of JOOBLE_RADII) {
    const diff = Math.abs(km - value)
    if (diff < bestDiff) {
      best = value
      bestDiff = diff
    }
  }
  return String(best)
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function searchJooble(
  params: AggregateSearchParams,
  credentials: ProviderCredentials,
): Promise<ProviderResult> {
  if (!credentials.joobleApiKey) {
    return {
      source: 'jooble',
      label: 'Jooble',
      jobs: [],
      total: 0,
      status: 'skipped',
      message: 'JOOBLE_API_KEY nicht gesetzt',
    }
  }

  const body = {
    keywords: params.was || 'Job',
    location: params.wo || 'Deutschland',
    radius: nearestJoobleRadius(params.umkreis),
    page: String(params.page ?? 1),
    ResultOnPage: String(params.size ?? 20),
    companysearch: 'false',
  }

  try {
    const response = await fetch(`https://jooble.org/api/${credentials.joobleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return {
        source: 'jooble',
        label: 'Jooble',
        jobs: [],
        total: 0,
        status: 'error',
        message: `HTTP ${response.status}`,
      }
    }

    const data = (await response.json()) as JoobleResponse
    const jobs: NormalizedJob[] = (data.jobs ?? [])
      .filter((job): job is JoobleJob & { id: string | number; title: string; link: string } =>
        Boolean(job.id && job.title && job.link),
      )
      .map((job) => ({
        id: `jooble-${job.id}`,
        source: 'jooble' as const,
        title: job.title,
        company: job.company,
        locationLabel: job.location,
        url: job.link,
        publishedAt: job.updated,
        description: job.snippet ? stripHtml(job.snippet) : undefined,
        salary: job.salary || undefined,
        occupation: job.type || undefined,
      }))

    return {
      source: 'jooble',
      label: 'Jooble',
      jobs,
      total: data.totalCount ?? jobs.length,
      status: 'ok',
    }
  } catch (error) {
    return {
      source: 'jooble',
      label: 'Jooble',
      jobs: [],
      total: 0,
      status: 'error',
      message: error instanceof Error ? error.message : 'Request failed',
    }
  }
}
