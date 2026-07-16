<script setup lang="ts">
import type { JobOffer } from '../types/job'
import JobCard from './JobCard.vue'

defineProps<{
  jobs: JobOffer[]
  total: number
  loading: boolean
  error: string | null
  page: number
  hasSearched: boolean
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

function formatCount(n: number) {
  return new Intl.NumberFormat('de-DE').format(n)
}
</script>

<template>
  <section class="results" aria-live="polite">
    <div v-if="loading" class="state state-loading">
      <div class="spinner" aria-hidden="true" />
      <p>Stellen in deiner Umgebung werden geladen…</p>
    </div>

    <div v-else-if="error" class="state state-error">
      <p>{{ error }}</p>
      <p class="hint">Prüfe Ort und Internetverbindung und versuche es erneut.</p>
    </div>

    <div v-else-if="!hasSearched" class="state state-idle">
      <p>Starte mit einem Beruf und einem Ort — oder nutze deinen Standort.</p>
    </div>

    <div v-else-if="jobs.length === 0" class="state">
      <p>Keine Stellen gefunden. Probiere einen größeren Umkreis oder andere Stichworte.</p>
    </div>

    <template v-else>
      <header class="results-header">
        <h2>{{ formatCount(total) }} Stellen gefunden</h2>
        <p>Seite {{ page }} · sortiert nach Nähe zur Suche</p>
      </header>

      <div class="job-list">
        <JobCard
          v-for="(job, index) in jobs"
          :key="job.refnr"
          :job="job"
          :style="{ animationDelay: `${Math.min(index, 10) * 40}ms` }"
        />
      </div>

      <nav v-if="total > 20" class="pager" aria-label="Seitennavigation">
        <button type="button" class="page-btn" :disabled="page <= 1" @click="emit('pageChange', page - 1)">
          Zurück
        </button>
        <span>Seite {{ page }}</span>
        <button
          type="button"
          class="page-btn"
          :disabled="page * 20 >= total"
          @click="emit('pageChange', page + 1)"
        >
          Weiter
        </button>
      </nav>
    </template>
  </section>
</template>

<style scoped>
.results {
  margin-top: 2rem;
  min-height: 12rem;
}

.results-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  align-items: baseline;
  margin-bottom: 0.5rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border);
}

.results-header h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.02em;
}

.results-header p {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.state {
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--muted);
}

.state p {
  margin: 0;
}

.state .hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.state-error {
  color: var(--danger);
}

.state-loading {
  display: grid;
  justify-items: center;
  gap: 0.85rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 3px solid var(--accent-soft);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  color: var(--muted);
}

.page-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--ink);
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  border-color: var(--accent);
  color: var(--accent);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
