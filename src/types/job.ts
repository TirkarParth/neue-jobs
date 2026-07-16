export interface JobCoordinates {
  lat: number
  lon: number
}

export interface JobLocation {
  plz?: string
  ort?: string
  strasse?: string
  region?: string
  land?: string
  koordinaten?: JobCoordinates
  entfernung?: string
}

export interface JobOffer {
  beruf?: string
  titel: string
  refnr: string
  arbeitsort?: JobLocation
  arbeitgeber?: string
  aktuelleVeroeffentlichungsdatum?: string
  eintrittsdatum?: string
  kundennummerHash?: string
}

export interface JobSearchResponse {
  stellenangebote: JobOffer[]
  maxErgebnisse?: number
  page?: number
  size?: number
  took?: number
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
}

export type Arbeitszeit = 'vz' | 'tz' | 'ho' | 'snw' | 'mj'

export interface SearchFormState {
  was: string
  wo: string
  umkreis: number
  arbeitszeit: '' | Arbeitszeit
  angebotsart: number | ''
}
