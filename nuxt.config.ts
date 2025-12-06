import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],

  // https://devtools.nuxt.com
  devtools: {
    enabled: true,
  },
  future: { compatibilityVersion: 4 },
  hub: {
    cache: true,
  },
  vite: {
    plugins: [codeInspectorPlugin({ bundler: 'vite' })],
  },
  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
