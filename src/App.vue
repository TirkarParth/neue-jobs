<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <div class="atmosphere" aria-hidden="true" />
    <header class="topbar">
      <RouterLink class="logo" to="/">NahJobs</RouterLink>
      <nav>
        <RouterLink to="/">Suche</RouterLink>
        <RouterLink to="/ueber">Über</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <p>
        NahJobs · Stellenangebote Deutschland · Daten:
        <a
          href="https://www.arbeitsagentur.de/jobsuche/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bundesagentur für Arbeit
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 1.1rem 1.15rem 1.5rem;
}

.atmosphere {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(900px 480px at 12% -10%, rgba(61, 140, 118, 0.22), transparent 60%),
    radial-gradient(700px 420px at 92% 8%, rgba(196, 154, 74, 0.16), transparent 55%),
    linear-gradient(165deg, #e8f0ec 0%, #f3f1ea 42%, #e7eef5 100%);
}

.atmosphere::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(26, 46, 40, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26, 46, 40, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 75%);
}

.topbar {
  width: min(920px, 100%);
  margin: 0 auto 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  animation: fade 0.5s ease both;
}

.logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}

nav a.router-link-active,
nav a:hover {
  color: var(--ink);
}

main {
  width: 100%;
}

.footer {
  width: min(920px, 100%);
  margin: 2.5rem auto 0;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.85rem;
}

.footer p {
  margin: 0;
}

.footer a {
  color: var(--ink-soft);
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
