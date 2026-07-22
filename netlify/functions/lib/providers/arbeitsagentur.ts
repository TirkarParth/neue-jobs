import type { AggregateSearchParams, NormalizedJob, ProviderResult } from '../types'

const BA_BASE =
  'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs'
const API_KEY = 'jobboerse-jobsuche'

interface BaJob {
  beruf?: string
  titel?: string
  refnr?: string
  arbeitsort?: {
    plz?: string
    ort?: string
    region?: string
    entfernung?: string
  }
  arbeitgeber?: string
  aktuelleVeroeffentlichungsdatum?: string
}

interface BaResponse {
  stellenangebote?: BaJob[]
  maxErgebnisse?: number
}

export async function searchArbeitsagentur(
  params: AggregateSearchParams,
): Promise<ProviderResult> {
  const query = new URLSearchParams()
  if (params.was) query.set('was', params.was)
  if (params.wo) query.set('wo', params.wo)
  if (params.umkreis != null) query.set('umkreis', String(params.umkreis))
  if (params.angebotsart != null) query.set('angebotsart', String(params.angebotsart))
  if (params.arbeitszeit) query.set('arbeitszeit', params.arbeitszeit)
  if (params.befristung != null) query.set('befristung', String(params.befristung))
  if (params.veroeffentlichtseit != null) {
    query.set('veroeffentlichtseit', String(params.veroeffentlichtseit))
  }
  query.set('page', String(params.page ?? 1))
  query.set('size', String(params.size ?? 20))

  try {
    const response = await fetch(`${BA_BASE}?${query.toString()}`, {
      headers: {
        'X-API-Key': API_KEY,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return {
        source: 'arbeitsagentur',
        label: 'Arbeitsagentur',
        jobs: [],
        total: 0,
        status: 'error',
        message: `HTTP ${response.status}`,
      }
    }

    const data = (await response.json()) as BaResponse
    const jobs: NormalizedJob[] = (data.stellenangebote ?? [])
      .filter((job): job is BaJob & { refnr: string; titel: string } =>
        Boolean(job.refnr && job.titel),
      )
      .map((job) => {
        const locationParts = [
          job.arbeitsort?.plz,
          job.arbeitsort?.ort,
          job.arbeitsort?.region,
        ].filter(Boolean)

        const distanceRaw = job.arbeitsort?.entfernung
        const distanceKm = distanceRaw ? Number.parseFloat(distanceRaw) : undefined

        return {
          id: `ba-${job.refnr}`,
          source: 'arbeitsagentur' as const,
          title: job.titel,
          company: job.arbeitgeber,
          locationLabel: locationParts.join(' · ') || undefined,
          distanceKm: Number.isFinite(distanceKm) ? distanceKm : undefined,
          url: `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(job.refnr)}`,
          publishedAt: job.aktuelleVeroeffentlichungsdatum,
          occupation: job.beruf,
        }
      })

    return {
      source: 'arbeitsagentur',
      label: 'Arbeitsagentur',
      jobs,
      total: data.maxErgebnisse ?? jobs.length,
      status: 'ok',
    }
  } catch (error) {
    return {
      source: 'arbeitsagentur',
      label: 'Arbeitsagentur',
      jobs: [],
      total: 0,
      status: 'error',
      message: error instanceof Error ? error.message : 'Request failed',
    }
  }
}
