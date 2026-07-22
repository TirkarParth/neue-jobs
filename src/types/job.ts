export type JobSource = 'arbeitsagentur' | 'adzuna' | 'jooble'

export type Arbeitszeit = 'vz' | 'tz' | 'ho' | 'snw' | 'mj'

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

export interface SourceStatus {
  id: JobSource
  label: string
  status: 'ok' | 'skipped' | 'error'
  total?: number
  message?: string
}

export interface JobSearchResponse {
  jobs: NormalizedJob[]
  total: number
  page: number
  size: number
  sources: SourceStatus[]
}

export interface JobSearchParams {
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

export interface SearchFormState {
  was: string
  wo: string
  umkreis: number
  arbeitszeit: '' | Arbeitszeit
  angebotsart: number | ''
  sources: JobSource[]
}

export const SOURCE_OPTIONS: { id: JobSource; label: string }[] = [
  { id: 'arbeitsagentur', label: 'Arbeitsagentur' },
  { id: 'adzuna', label: 'Adzuna' },
  { id: 'jooble', label: 'Jooble' },
]
