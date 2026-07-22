<script setup lang="ts">
import type { NormalizedJob } from '../types/job'
import { SOURCE_OPTIONS } from '../types/job'

defineProps<{
  job: NormalizedJob
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

function sourceLabel(source: NormalizedJob['source']) {
  return SOURCE_OPTIONS.find((option) => option.id === source)?.label ?? source
}
</script>

<template>
  <article class="job">
    <div class="job-top">
      <div class="title-block">
        <span class="source-badge" :data-source="job.source">{{ sourceLabel(job.source) }}</span>
        <h3 class="job-title">
          <a :href="job.url" target="_blank" rel="noopener noreferrer">
            {{ job.title }}
          </a>
        </h3>
      </div>
      <span v-if="job.distanceKm != null" class="distance"> {{ job.distanceKm }} km </span>
    </div>

    <p class="employer">{{ job.company || 'Arbeitgeber nicht angegeben' }}</p>

    <div class="meta">
      <span v-if="job.locationLabel">{{ job.locationLabel }}</span>
      <span v-if="job.occupation">{{ job.occupation }}</span>
      <span v-if="job.salary">{{ job.salary }}</span>
      <span v-if="formatDate(job.publishedAt)">
        Veröffentlicht {{ formatDate(job.publishedAt) }}
      </span>
    </div>

    <p v-if="job.description" class="snippet">{{ job.description }}</p>

    <a class="job-cta" :href="job.url" target="_blank" rel="noopener noreferrer">
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

.title-block {
  display: grid;
  gap: 0.4rem;
}

.source-badge {
  justify-self: start;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.22rem 0.55rem;
  background: var(--accent-soft);
  color: var(--accent);
}

.source-badge[data-source='adzuna'] {
  background: #e8eef8;
  color: #2a4f8f;
}

.source-badge[data-source='jooble'] {
  background: #f5ebe0;
  color: #8a4b1f;
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

.snippet {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
