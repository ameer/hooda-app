<template>
  <v-app dark>
    <v-main class="primary">
      <Nuxt />
    </v-main>
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
