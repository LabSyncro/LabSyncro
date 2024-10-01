import env from 'dotenv';
env.config();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  eslint: {},
  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_PORT: process.env.DATABASE_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
});
