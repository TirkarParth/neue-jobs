<script setup lang="ts">
import type { JobOffer } from '../types/job'

defineProps<{
  job: JobOffer
}>()

function formatDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function jobUrl(refnr: string) {
  return `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(refnr)}`
}
</script>

<template>
  <article class="job">
    <div class="job-top">
      <h3 class="job-title">
        <a :href="jobUrl(job.refnr)" target="_blank" rel="noopener noreferrer">
          {{ job.titel }}
        </a>
      </h3>
      <span v-if="job.arbeitsort?.entfernung" class="distance">
        {{ job.arbeitsort.entfernung }} km
      </span>
    </div>

    <p class="employer">{{ job.arbeitgeber || 'Arbeitgeber nicht angegeben' }}</p>

    <div class="meta">
      <span v-if="job.arbeitsort?.ort">
        {{ [job.arbeitsort.plz, job.arbeitsort.ort].filter(Boolean).join(' ') }}
        <template v-if="job.arbeitsort.region"> · {{ job.arbeitsort.region }}</template>
      </span>
      <span v-if="job.beruf">{{ job.beruf }}</span>
      <span v-if="formatDate(job.aktuelleVeroeffentlichungsdatum)">
        Veröffentlicht {{ formatDate(job.aktuelleVeroeffentlichungsdatum) }}
      </span>
    </div>

    <a class="job-cta" :href="jobUrl(job.refnr)" target="_blank" rel="noopener noreferrer">
      Zur Anzeige
      <span aria-hidden="true">→</span>
    </a>
  </article>
</template>

<style scoped>
.job {
  display: grid;
  gap: 0.55rem;
  padding: 1.15rem 0;
  border-bottom: 1px solid var(--border);
  animation: fade-in 0.45s ease both;
}

.job-top {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: start;
}

.job-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.job-title a {
  color: inherit;
  text-decoration: none;
}

.job-title a:hover {
  color: var(--accent);
}

.distance {
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
}

.employer {
  margin: 0;
  color: var(--ink-soft);
  font-weight: 600;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.85rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.job-cta {
  justify-self: start;
  margin-top: 0.25rem;
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
}

.job-cta:hover {
  text-decoration: underline;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
