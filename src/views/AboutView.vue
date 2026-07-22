<script setup lang="ts">
</script>

<template>
  <article class="about">
    <p class="eyebrow">Über NahJobs</p>
    <h1>Jobangebote in Deutschland, nah an dir</h1>
    <p>
      NahJobs ist eine schlanke Vue-App für die Stellensuche in Deutschland. Du suchst nach
      Stichwort und Ort — optional mit GPS — und erhältst Angebote im gewählten Umkreis.
    </p>
    <p>
      Die Suche aggregiert mehrere Quellen: die Jobsuche der Bundesagentur für Arbeit
      (immer aktiv), plus Adzuna und Jooble wenn API-Keys gesetzt sind. Antworten werden
      normalisiert, zusammengeführt und bereinigt — über Netlify Functions in Produktion
      und einen Vite-Middleware-Proxy lokal.
    </p>
    <ul>
      <li>Vue 3 + TypeScript + Vite</li>
      <li>Quellen: Arbeitsagentur, Adzuna, Jooble</li>
      <li>Standortsuche mit Browser-Geolocation und OpenStreetMap Nominatim</li>
      <li>Filter für Angebotsart und Arbeitszeit (Arbeitsagentur)</li>
      <li>Bereit für Netlify-Deploy mit SPA-Rewrites</li>
    </ul>
    <RouterLink class="back" to="/">← Zurück zur Suche</RouterLink>
  </article>
</template>

<style scoped>
.about {
  width: min(680px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  padding: 1.5rem 0 3rem;
  animation: rise 0.5s ease both;
}

.eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

p,
li {
  color: var(--ink-soft);
  line-height: 1.6;
}

p {
  margin: 0;
}

ul {
  margin: 0.4rem 0 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.35rem;
}

.back {
  margin-top: 0.75rem;
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
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
