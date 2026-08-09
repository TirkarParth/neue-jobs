export function formatSourceStatus(status: 'ok' | 'skipped' | 'error'): string {
  if (status === 'ok') return 'aktiv'
  if (status === 'skipped') return 'ohne API-Key'
  return 'Fehler'
}
