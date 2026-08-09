import { ref } from 'vue'
import { searchJobs } from '../api/jobs'
import type { JobSearchParams, NormalizedJob, SourceStatus } from '../types/job'

export function useJobSearch() {
  const jobs = ref<NormalizedJob[]>([])
  const total = ref(0)
  const sources = ref<SourceStatus[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastParams = ref<JobSearchParams | null>(null)
  const page = ref(1)

  async function search(params: JobSearchParams) {
    loading.value = true
    error.value = null
    lastParams.value = { ...params }
    page.value = params.page ?? 1

    try {
      const data = await searchJobs({
        size: 20,
        ...params,
      })
      jobs.value = data.jobs ?? []
      total.value = data.total ?? jobs.value.length
      sources.value = data.sources ?? []

      const noSuccessfulSource =
        jobs.value.length === 0 &&
        sources.value.length > 0 &&
        sources.value.every((source) => source.status !== 'ok')

      if (noSuccessfulSource) {
        error.value =
          data.warning ||
          'Keine Quelle lieferte Ergebnisse. Prüfe API-Keys oder versuche es später erneut.'
      }
    } catch (err) {
      jobs.value = []
      total.value = 0
      sources.value = []
      error.value = err instanceof Error ? err.message : 'Unbekannter Fehler'
    } finally {
      loading.value = false
    }
  }

  async function goToPage(nextPage: number) {
    if (!lastParams.value) return
    await search({ ...lastParams.value, page: nextPage })
  }

  return {
    jobs,
    total,
    sources,
    loading,
    error,
    page,
    search,
    goToPage,
  }
}
