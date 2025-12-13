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
  app: {
    baseURL: '/ideal-university-station/',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo.svg' },
      ],
    },
  },

  css: ['~/assets/styles/main.css'],

  // https://tailwindcss.nuxtjs.org/
  // tailwindcss: {
  //   exposeConfig: true,
  //   viewer: true,
  //   // and more...
  // },

  // https://github.com/nuxt/ui/issues/4109#issuecomment-2886223806
  ui: {
    fonts: false,
  },

  compatibilityDate: '2025-12-11',
  nitro: {
    preset: 'github-pages',
  },
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
      icons: [
        'lucide:chevron-down',
        'lucide:upload',
        'lucide:chevrons-right',
        'lucide:chevron-right',
        'lucide:refresh-cw',
        'lucide:menu',
        'lucide:panel-left-open',
        'lucide:panel-left-close',
        'lucide:check',
      ],
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
})
