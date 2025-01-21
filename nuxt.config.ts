// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    preset: 'node'
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  experimental: {
    payloadExtraction: false
  },

  routeRules: {
    '/admin/**': { ssr: false },
    '/auth/**': { ssr: false }
  },

  compatibilityDate: '2025-01-16'
})