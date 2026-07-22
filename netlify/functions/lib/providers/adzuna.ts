import type {
  AggregateSearchParams,
  NormalizedJob,
  ProviderCredentials,
  ProviderResult,
} from '../types'

interface AdzunaJob {
  id?: string | number
  title?: string
  description?: string
  created?: string
  redirect_url?: string
  latitude?: number
  longitude?: number
  salary_min?: number
  salary_max?: number
  company?: { display_name?: string }
  location?: { display_name?: string; area?: string[] }
  category?: { label?: string }
}

interface AdzunaResponse {
  results?: AdzunaJob[]
  count?: number
}

function formatSalary(min?: number, max?: number): string | undefined {
  if (min == null && max == null) return undefined
  const fmt = (n: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n)
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`
  if (min != null) return `ab ${fmt(min)}`
  return `bis ${fmt(max!)}`
}

export async function searchAdzuna(
  params: AggregateSearchParams,
  credentials: ProviderCredentials,
): Promise<ProviderResult> {
  if (!credentials.adzunaAppId || !credentials.adzunaAppKey) {
    return {
      source: 'adzuna',
      label: 'Adzuna',
      jobs: [],
      total: 0,
      status: 'skipped',
      message: 'ADZUNA_APP_ID / ADZUNA_APP_KEY nicht gesetzt',
    }
  }

  const page = params.page ?? 1
  const size = params.size ?? 20
  const query = new URLSearchParams({
    app_id: credentials.adzunaAppId,
    app_key: credentials.adzunaAppKey,
    results_per_page: String(size),
    content_type: 'application/json',
  })

  if (params.was) query.set('what', params.was)
  if (params.wo) query.set('where', params.wo)
  if (params.umkreis != null) query.set('distance', String(params.umkreis))

  const url = `https://api.adzuna.com/v1/api/jobs/de/search/${page}?${query.toString()}`

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      return {
        source: 'adzuna',
        label: 'Adzuna',
        jobs: [],
        total: 0,
        status: 'error',
        message: `HTTP ${response.status}`,
      }
    }

    const data = (await response.json()) as AdzunaResponse
    const jobs: NormalizedJob[] = (data.results ?? [])
      .filter((job): job is AdzunaJob & { id: string | number; title: string; redirect_url: string } =>
        Boolean(job.id && job.title && job.redirect_url),
      )
      .map((job) => ({
        id: `adzuna-${job.id}`,
        source: 'adzuna' as const,
        title: job.title,
        company: job.company?.display_name,
        locationLabel: job.location?.display_name,
        url: job.redirect_url,
        publishedAt: job.created,
        occupation: job.category?.label,
        description: job.description,
        salary: formatSalary(job.salary_min, job.salary_max),
      }))

    return {
      source: 'adzuna',
      label: 'Adzuna',
      jobs,
      total: data.count ?? jobs.length,
      status: 'ok',
    }
  } catch (error) {
    return {
      source: 'adzuna',
      label: 'Adzuna',
      jobs: [],
      total: 0,
      status: 'error',
      message: error instanceof Error ? error.message : 'Request failed',
    }
  }
}
