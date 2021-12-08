export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - app',
    title: 'هودا',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'vue-toastification/nuxt'
  ],
  auth: {
    // Options
  },
  toast: {
    timeout: 3000,
    rtl: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: false,
    transition: 'Vue-Toastification__fade',
    maxToasts: 3,
    newestOnTop: true
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseUrl: 'http://192.168.1.189:8000/api/v1/',
    credentials: true
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: {
      font: false,
      icons: false
    },
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    optionsPath: './vuetify.options.js'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
