import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxthub/core',
  ],

  compatibilityDate: '2025-12-11',

  // https://devtools.nuxt.com
  devtools: {
    enabled: true,
  },
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
  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
      sizeLimitKb: 0,
    },
    customCollections: [
      {
        prefix: 'icon',
        dir: './app/assets/icons',
      },
      {
        prefix: 'metro',
        dir: './app/assets/metros',
      },
      {
        prefix: 'university',
        dir: './app/assets/universities',
      },
    ],
  },

  // https://tailwindcss.nuxtjs.org/
  // tailwindcss: {
  //   exposeConfig: true,
  //   viewer: true,
  //   // and more...
  // },
})
