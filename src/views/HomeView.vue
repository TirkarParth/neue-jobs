<script setup lang="ts">
import { ref } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import JobList from '../components/JobList.vue'
import { useGeolocation } from '../composables/useGeolocation'
import { useJobSearch } from '../composables/useJobSearch'
import type { JobSearchParams, SearchFormState } from '../types/job'

const searchForm = ref<InstanceType<typeof SearchForm> | null>(null)
const hasSearched = ref(false)

const { locating, locationError, detectLocation } = useGeolocation()
const { jobs, total, sources, loading, error, page, search, goToPage } = useJobSearch()

async function onSearch(form: SearchFormState) {
  hasSearched.value = true

  const params: JobSearchParams = {
    was: form.was.trim() || undefined,
    wo: form.wo.trim(),
    umkreis: form.umkreis,
    page: 1,
    size: 20,
    sources: form.sources,
  }

  if (form.arbeitszeit) params.arbeitszeit = form.arbeitszeit
  if (form.angebotsart !== '') params.angebotsart = Number(form.angebotsart)

  await search(params)
}

async function onLocate() {
  const place = await detectLocation()
  if (place) {
    searchForm.value?.setPlace(place)
  }
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <p class="brand">NahJobs</p>
      <h1>Stellen in deiner Nähe — aus mehreren Quellen in Deutschland</h1>
      <p class="lede">
        Suche nach Beruf und Ort, oder nutze deinen Standort. Ergebnisse kommen von der
        Arbeitsagentur (Jobsuche v6) sowie Adzuna und Jooble (mit API-Keys).
      </p>

      <SearchForm
        ref="searchForm"
        :locating="locating"
        :location-error="locationError"
        @search="onSearch"
        @locate="onLocate"
      />
    </section>

    <JobList
      :jobs="jobs"
      :total="total"
      :sources="sources"
      :loading="loading"
      :error="error"
      :page="page"
      :has-searched="hasSearched"
      @page-change="goToPage"
    />
  </div>
</template>

<style scoped>
.home {
  width: min(920px, 100%);
  margin: 0 auto;
}

.hero {
  display: grid;
  gap: 1rem;
  padding: 1.5rem 0 0.5rem;
}

.brand {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 4.4rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.95;
  color: var(--ink);
  animation: brand-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

h1 {
  margin: 0;
  max-width: 22ch;
  font-family: var(--font-body);
  font-size: clamp(1.15rem, 2.6vw, 1.45rem);
  font-weight: 600;
  line-height: 1.35;
  color: var(--ink-soft);
  animation: rise 0.7s ease both;
  animation-delay: 0.05s;
}

.lede {
  margin: 0 0 0.4rem;
  max-width: 46ch;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.55;
  animation: rise 0.7s ease both;
  animation-delay: 0.1s;
}

@keyframes brand-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
