import type { AggregateSearchParams, ProviderResult } from '../types'
import { baHeaders, BA_SEARCH_URL } from './ba-config'
import { mapBaV6Response } from './ba-mapper'
import type { BaV6SearchResponse } from './ba-v6-types'

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
    const response = await fetch(`${BA_SEARCH_URL}?${query.toString()}`, {
      headers: baHeaders(),
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

    const data = (await response.json()) as BaV6SearchResponse
    const mapped = mapBaV6Response(data)

    return {
      source: 'arbeitsagentur',
      label: 'Arbeitsagentur',
      jobs: mapped.jobs,
      total: mapped.total,
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
