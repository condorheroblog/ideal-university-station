// https://github.com/nuxt-modules/tailwindcss/issues/919
import tailwindcss from '@tailwindcss/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    // '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxthub/core',
  ],

  // https://devtools.nuxt.com
  devtools: {
    enabled: true,
  },
  css: ['~/assets/styles/main.css'],

  compatibilityDate: '2025-12-11',
  hub: {
    cache: true,
  },
  vite: {
    plugins: [
      tailwindcss(),
      codeInspectorPlugin({ bundler: 'vite' }),
    ],
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
