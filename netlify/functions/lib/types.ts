export type JobSource = 'arbeitsagentur' | 'adzuna' | 'jooble'

export interface AggregateSearchParams {
  was?: string
  wo?: string
  umkreis?: number
  page?: number
  size?: number
  angebotsart?: number
  arbeitszeit?: string
  befristung?: number
  veroeffentlichtseit?: number
  sources?: JobSource[]
}

export interface NormalizedJob {
  id: string
  source: JobSource
  title: string
  company?: string
  locationLabel?: string
  distanceKm?: number
  url: string
  publishedAt?: string
  occupation?: string
  description?: string
  salary?: string
}

export interface SourceResultStatus {
  id: JobSource
  label: string
  status: 'ok' | 'skipped' | 'error'
  total?: number
  message?: string
}

export interface AggregateSearchResponse {
  jobs: NormalizedJob[]
  total: number
  page: number
  size: number
  sources: SourceResultStatus[]
}

export interface ProviderResult {
  source: JobSource
  label: string
  jobs: NormalizedJob[]
  total: number
  status: 'ok' | 'skipped' | 'error'
  message?: string
}

export interface ProviderCredentials {
  adzunaAppId?: string
  adzunaAppKey?: string
  joobleApiKey?: string
}

export const SOURCE_LABELS: Record<JobSource, string> = {
  arbeitsagentur: 'Arbeitsagentur',
  adzuna: 'Adzuna',
  jooble: 'Jooble',
}

export const ALL_SOURCES: JobSource[] = ['arbeitsagentur', 'adzuna', 'jooble']
