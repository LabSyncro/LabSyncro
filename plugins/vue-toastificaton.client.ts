import Toast, { type PluginOptions } from 'vue-toastification'

const options: PluginOptions = {
  // We can set our default options here
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options)
})