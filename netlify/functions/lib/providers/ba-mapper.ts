import type { NormalizedJob } from '../types'
import type { BaV6Job, BaV6SearchResponse } from './ba-v6-types'

function firstLocation(job: BaV6Job) {
  return job.stellenlokationen?.[0]
}

function locationLabel(job: BaV6Job): string | undefined {
  const address = firstLocation(job)?.adresse
  if (!address) return undefined

  const parts = [address.plz, address.ort, address.region]
    .map((part) => part?.trim())
    .filter(Boolean)

  return parts.length > 0 ? parts.join(' · ') : undefined
}

function publishedAt(job: BaV6Job): string | undefined {
  return (
    job.datumErsteVeroeffentlichung ||
    job.veroeffentlichungszeitraum?.von ||
    job.aenderungsdatum
  )
}

export function mapBaV6Job(job: BaV6Job): NormalizedJob | null {
  const title = job.stellenangebotsTitel?.trim()
  const refnr = job.referenznummer?.trim()
  if (!title || !refnr) return null

  const distanceKm =
    typeof job.entfernung === 'number' && Number.isFinite(job.entfernung)
      ? job.entfernung
      : undefined

  return {
    id: `ba-${refnr}`,
    source: 'arbeitsagentur',
    title,
    company: job.firma?.trim() || undefined,
    locationLabel: locationLabel(job),
    distanceKm,
    url: `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(refnr)}`,
    publishedAt: publishedAt(job),
    occupation: job.hauptberuf?.trim() || job.weitereBerufe?.[0],
  }
}

export function mapBaV6Response(data: BaV6SearchResponse): {
  jobs: NormalizedJob[]
  total: number
} {
  const jobs = (data.ergebnisliste ?? [])
    .map(mapBaV6Job)
    .filter((job): job is NormalizedJob => job != null)

  const rawTotal = data.maxErgebnisse
  const total =
    typeof rawTotal === 'number'
      ? rawTotal
      : typeof rawTotal === 'string'
        ? Number.parseInt(rawTotal, 10)
        : jobs.length

  return {
    jobs,
    total: Number.isFinite(total) ? total : jobs.length,
  }
}
