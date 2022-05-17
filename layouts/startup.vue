<template>
  <v-app dark>
    <v-main class="primary">
      <Nuxt />
    </v-main>
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  auth: false,
  data () {
    return {
      title: 'هــودا'
    }
  }
}
</script>
