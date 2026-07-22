import type { JobSearchParams, JobSearchResponse } from '../types/job'

function apiBase(): string {
  return '/api'
}

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      if (value.length > 0) query.set(key, value.join(','))
      return
    }
    query.set(key, String(value))
  })

  const response = await fetch(`${apiBase()}/search-jobs?${query.toString()}`)

  if (!response.ok) {
    let message = `Suche fehlgeschlagen (${response.status})`
    try {
      const errorBody = (await response.json()) as { error?: string }
      if (errorBody.error) message = errorBody.error
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  return (await response.json()) as JobSearchResponse
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'de')

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Standort konnte nicht ermittelt werden')
  }

  const data = (await response.json()) as {
    address?: {
      city?: string
      town?: string
      village?: string
      municipality?: string
      suburb?: string
      state?: string
    }
  }

  const address = data.address ?? {}
  const place =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.suburb ||
    address.state

  if (!place) {
    throw new Error('Kein Ort für diesen Standort gefunden')
  }

  return place
}
