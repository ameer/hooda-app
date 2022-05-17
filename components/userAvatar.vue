<template>
  <div v-if="user !== null" class="text-center mt-4">
    <v-avatar size="64" color="primary">
      <v-icon dark size="48">
        mdi-account-circle
      </v-icon>
    </v-avatar>
    <div class="text-body-1 text--primary mt-3">
      {{ user.fullname }}
    </div>
    <div class="text-subtitle text--secondary mb-2">
      {{ user.phone }}
    </div>
    <div class="d-flex align-center justify-space-around">
      <v-btn
        color="primary"
        outlined
        small
        width="45%"
      >
        <v-icon x-small left>
          mdi-pencil-outline
        </v-icon>
        ویرایش
      </v-btn>
      <v-btn
        color="error"
        outlined
        small
        width="45%"
        @click="logout"
      >
        <v-icon x-small left>
          mdi-logout
        </v-icon>
        خروج
      </v-btn>
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
