import type { SourceResultStatus } from './types'

export function hasSuccessfulSource(sources: SourceResultStatus[]): boolean {
  return sources.some((source) => source.status === 'ok')
}

export function summarizeSourceFailures(sources: SourceResultStatus[]): string {
  const parts = sources
    .filter((source) => source.status !== 'ok')
    .map((source) => {
      if (source.status === 'skipped') {
        return `${source.label}: übersprungen (${source.message ?? 'ohne API-Key'})`
      }
      return `${source.label}: Fehler${source.message ? ` (${source.message})` : ''}`
    })

  if (parts.length === 0) return 'Keine Stellen gefunden.'
  return `Keine Quelle lieferte nutzbare Ergebnisse. ${parts.join(' · ')}`
}
