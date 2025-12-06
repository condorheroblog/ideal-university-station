# Project Rules

Tech Stack
- Nuxt 4 with Composition API and `<script setup lang="ts">`
- TailwindCSS via `@nuxtjs/tailwindcss`
- Icons via `@nuxt/icon` (Iconify, `ri:*` set installed)
- TypeScript enabled (`tsconfig` extends `.nuxt/tsconfig.json`)

Routing & Structure
- Use Nuxt file-based routing under `pages/`
- Keep shared UI as components in `components/`
- Use client-only rendering for time-dependent UI to avoid SSR mismatch

Styling
- Prefer Tailwind utility classes for layout and spacing
- Use dark-friendly colors for wallpaper previews

Type Safety
- Use explicit types for reactive state and helpers
- Avoid `any`; use unions and literals where applicable

Conventions
- `<script setup lang="ts">` for all pages/components
- Avoid global styles; prefer component styles or Tailwind
- Use `Icon` component for icons, e.g. `ri:camera-line`, `ri:flashlight-line`
