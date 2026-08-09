<script setup lang="ts">
import type { NormalizedJob, SourceStatus } from '../types/job'
import { formatSourceStatus } from '../utils/sourceStatus'
import JobCard from './JobCard.vue'

defineProps<{
  jobs: NormalizedJob[]
  total: number
  loading: boolean
  error: string | null
  page: number
  hasSearched: boolean
  sources: SourceStatus[]
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
      <p>Stellen aus mehreren Quellen werden geladen…</p>
    </div>

    <div v-else-if="error" class="state state-error">
      <p>{{ error }}</p>
      <p class="hint">Prüfe Ort und Internetverbindung und versuche es erneut.</p>
    </div>

    <div v-else-if="!hasSearched" class="state state-idle">
      <p>Starte mit einem Beruf und einem Ort — Ergebnisse kommen von Arbeitsagentur, Adzuna und Jooble.</p>
    </div>

    <div v-else-if="jobs.length === 0" class="state">
      <p>
        Keine Stellen gefunden. Probiere einen größeren Umkreis, andere Stichworte oder mehr Quellen.
      </p>
      <ul v-if="sources.length" class="source-status">
        <li v-for="source in sources" :key="source.id">
          <strong>{{ source.label }}</strong>: {{ formatSourceStatus(source.status) }}
          <span v-if="source.message"> — {{ source.message }}</span>
        </li>
      </ul>
      <p v-if="sources.some((source) => source.status === 'error')" class="hint">
        Hinweis: Die Arbeitsagentur-Suche nutzt inzwischen die v6-API. Bei anhaltenden Fehlern
        Seite neu laden oder später erneut versuchen.
      </p>
    </div>

    <template v-else>
      <header class="results-header">
        <div>
          <h2>{{ formatCount(total) }} Stellen gefunden</h2>
          <p>Seite {{ page }} · zusammengeführt &amp; bereinigt</p>
        </div>
        <ul class="source-pills" aria-label="Quellenstatus">
          <li
            v-for="source in sources"
            :key="source.id"
            class="source-pill"
            :data-status="source.status"
            :title="source.message || formatSourceStatus(source.status)"
          >
            {{ source.label }}
            <span v-if="source.status === 'ok' && source.total != null">
              {{ formatCount(source.total) }}
            </span>
          </li>
        </ul>
      </header>

      <div class="job-list">
        <JobCard
          v-for="(job, index) in jobs"
          :key="job.id"
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
  display: grid;
  gap: 0.85rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border);
}

@media (min-width: 760px) {
  .results-header {
    grid-template-columns: 1fr auto;
    align-items: end;
  }
}

.results-header h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.02em;
}

.results-header p {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.source-pills,
.source-status {
  list-style: none;
  margin: 0;
  padding: 0;
}

.source-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  justify-content: flex-start;
}

.source-pill {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--accent-soft);
  color: var(--accent);
}

.source-pill[data-status='skipped'] {
  background: #eee9df;
  color: #6d6558;
}

.source-pill[data-status='error'] {
  background: #f6e4e4;
  color: var(--danger);
}

.source-status {
  margin-top: 1rem;
  display: grid;
  gap: 0.35rem;
  text-align: left;
  color: var(--muted);
  font-size: 0.9rem;
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
