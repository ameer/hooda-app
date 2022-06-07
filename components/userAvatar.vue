<template>
  <div v-if="user !== null" class="text-center mt-4">
    <div class="d-flex align-center justify-center mb-4">
      <v-avatar size="64" color="primary">
        <v-icon dark size="48">
          mdi-account-circle
        </v-icon>
      </v-avatar>
      <div class="mt-3 mx-2 text-right">
        <div class="text-body-1 text--primary">
          {{ user.fullname }}
        </div>
        <div class="text-body-2 text--secondary mb-2">
          {{ user.phone }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  methods: {
    logout () {
      // this.$auth.setUserToken(null)
      // this.$auth.setUser(null)
      this.$auth.$storage.removeUniversal('user')
      this.$auth.logout()
      // this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>
