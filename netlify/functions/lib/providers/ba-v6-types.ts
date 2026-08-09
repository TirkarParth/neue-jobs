export interface BaV6Address {
  strasse?: string
  hausnummer?: string
  plz?: string
  ort?: string
  region?: string
  land?: string
}

export interface BaV6Location {
  adresse?: BaV6Address
  breite?: number
  laenge?: number
}

export interface BaV6Job {
  stellenangebotsTitel?: string
  referenznummer?: string
  firma?: string
  hauptberuf?: string
  weitereBerufe?: string[]
  alleBerufe?: string[]
  entfernung?: number
  stellenlokationen?: BaV6Location[]
  datumErsteVeroeffentlichung?: string
  aenderungsdatum?: string
  veroeffentlichungszeitraum?: { von?: string; bis?: string }
  arbeitgeberKundennummerHash?: string
  stellenangebotsart?: string
  homeofficemoeglich?: boolean
}

export interface BaV6SearchResponse {
  ergebnisliste?: BaV6Job[]
  maxErgebnisse?: number | string
  page?: number | string
  size?: number | string
}
