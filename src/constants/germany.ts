export const GERMAN_CITIES = [
  'Berlin',
  'Hamburg',
  'München',
  'Köln',
  'Frankfurt am Main',
  'Stuttgart',
  'Düsseldorf',
  'Leipzig',
  'Dortmund',
  'Essen',
  'Bremen',
  'Dresden',
  'Hannover',
  'Nürnberg',
  'Duisburg',
] as const

export const RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
  { value: 200, label: '200 km' },
] as const

export const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Alle Angebotsarten' },
  { value: 1, label: 'Arbeit' },
  { value: 2, label: 'Selbstständigkeit' },
  { value: 4, label: 'Ausbildung / Duales Studium' },
  { value: 34, label: 'Praktikum / Trainee' },
] as const

export const WORK_TIME_OPTIONS = [
  { value: '', label: 'Alle Arbeitszeiten' },
  { value: 'vz', label: 'Vollzeit' },
  { value: 'tz', label: 'Teilzeit' },
  { value: 'ho', label: 'Homeoffice / Telearbeit' },
  { value: 'snw', label: 'Schicht / Nacht / Wochenende' },
  { value: 'mj', label: 'Minijob' },
] as const
