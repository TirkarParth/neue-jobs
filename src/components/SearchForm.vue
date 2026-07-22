<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  GERMAN_CITIES,
  JOB_TYPE_OPTIONS,
  RADIUS_OPTIONS,
  WORK_TIME_OPTIONS,
} from '../constants/germany'
import { SOURCE_OPTIONS, type JobSource, type SearchFormState } from '../types/job'

defineProps<{
  locating?: boolean
  locationError?: string | null
}>()

const emit = defineEmits<{
  search: [form: SearchFormState]
  locate: []
}>()

const form = reactive<SearchFormState>({
  was: '',
  wo: '',
  umkreis: 25,
  arbeitszeit: '',
  angebotsart: '',
  sources: SOURCE_OPTIONS.map((option) => option.id),
})

const showFilters = ref(false)

function submit() {
  emit('search', {
    ...form,
    sources: [...form.sources],
  })
}

function pickCity(city: string) {
  form.wo = city
}

function onLocate() {
  emit('locate')
}

function toggleSource(source: JobSource, checked: boolean) {
  if (checked) {
    if (!form.sources.includes(source)) form.sources.push(source)
    return
  }
  if (form.sources.length === 1) return
  form.sources = form.sources.filter((item) => item !== source)
}

defineExpose({
  setPlace(place: string) {
    form.wo = place
  },
})
</script>

<template>
  <form class="search-panel" @submit.prevent="submit">
    <div class="search-grid">
      <label class="field">
        <span class="field-label">Was suchst du?</span>
        <input
          v-model="form.was"
          type="search"
          name="was"
          placeholder="z. B. Pflegekraft, Entwickler, Bürokauffrau"
          autocomplete="off"
        />
      </label>

      <label class="field field-location">
        <span class="field-label">Wo in Deutschland?</span>
        <div class="location-row">
          <input
            v-model="form.wo"
            type="search"
            name="wo"
            placeholder="Stadt oder PLZ"
            required
            autocomplete="off"
          />
          <button
            type="button"
            class="btn-locate"
            :disabled="locating"
            :aria-busy="locating"
            @click="onLocate"
          >
            {{ locating ? 'Ort…' : 'Mein Standort' }}
          </button>
        </div>
        <p v-if="locationError" class="field-hint error">{{ locationError }}</p>
      </label>

      <label class="field field-radius">
        <span class="field-label">Umkreis</span>
        <select v-model.number="form.umkreis" name="umkreis">
          <option v-for="option in RADIUS_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="city-chips" aria-label="Beliebte Städte">
      <button
        v-for="city in GERMAN_CITIES.slice(0, 8)"
        :key="city"
        type="button"
        class="chip"
        @click="pickCity(city)"
      >
        {{ city }}
      </button>
    </div>

    <fieldset class="sources">
      <legend>Quellen</legend>
      <label v-for="option in SOURCE_OPTIONS" :key="option.id" class="source-option">
        <input
          type="checkbox"
          :checked="form.sources.includes(option.id)"
          @change="toggleSource(option.id, ($event.target as HTMLInputElement).checked)"
        />
        <span>{{ option.label }}</span>
      </label>
    </fieldset>

    <div class="search-actions">
      <button type="button" class="btn-ghost" @click="showFilters = !showFilters">
        {{ showFilters ? 'Filter ausblenden' : 'Mehr Filter' }}
      </button>
      <button type="submit" class="btn-primary">Stellen finden</button>
    </div>

    <div v-if="showFilters" class="filters">
      <label class="field">
        <span class="field-label">Angebotsart (Arbeitsagentur)</span>
        <select v-model="form.angebotsart" name="angebotsart">
          <option v-for="option in JOB_TYPE_OPTIONS" :key="String(option.value)" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <label class="field">
        <span class="field-label">Arbeitszeit (Arbeitsagentur)</span>
        <select v-model="form.arbeitszeit" name="arbeitszeit">
          <option v-for="option in WORK_TIME_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </form>
</template>

<style scoped>
.search-panel {
  width: 100%;
  display: grid;
  gap: 1.1rem;
  animation: rise 0.7s ease both;
  animation-delay: 0.12s;
}

.search-grid {
  display: grid;
  gap: 0.9rem;
}

@media (min-width: 800px) {
  .search-grid {
    grid-template-columns: 1.4fr 1.2fr 0.7fr;
    align-items: end;
  }
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.field input,
.field select {
  width: 100%;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.86);
  color: var(--ink);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font: inherit;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field input:focus,
.field select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  background: #fff;
}

.location-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

.btn-locate {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--ink);
  border-radius: 12px;
  padding: 0 1rem;
  font: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.btn-locate:hover:not(:disabled) {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.btn-locate:disabled {
  opacity: 0.65;
  cursor: wait;
}

.field-hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.field-hint.error {
  color: var(--danger);
}

.city-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.chip {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--ink-soft);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.chip:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

.sources {
  margin: 0;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.1rem;
  align-items: center;
}

.sources legend {
  padding: 0 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.source-option {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}

.source-option input {
  accent-color: var(--accent);
}

.search-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
}

.btn-primary,
.btn-ghost {
  font: inherit;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
}

.btn-primary {
  border: none;
  background: var(--accent);
  color: #fff;
  padding: 0.9rem 1.5rem;
  box-shadow: 0 12px 28px rgba(13, 90, 72, 0.22);
}

.btn-primary:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.btn-ghost {
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  padding: 0.7rem 0.4rem;
}

.btn-ghost:hover {
  color: var(--ink);
}

.filters {
  display: grid;
  gap: 0.9rem;
  padding-top: 0.4rem;
  border-top: 1px solid var(--border);
  animation: rise 0.35s ease both;
}

@media (min-width: 700px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
