<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-img src="/logo-dark-bg.svg" contain max-height="128px" />
      </v-col>
      <v-col cols="12" class="text-center">
        <nuxt-link to="/auth/signup" class="accent--text text-decoration-none">
          ثبت نام
        </nuxt-link>
      </v-col>
      <v-col cols="12" class="text-center">
        <nuxt-link to="/auth/login" class="accent--text text-decoration-none">
          ورود
        </nuxt-link>
      </v-col>
      <v-btn v-if="isLoggedIn" @click="logout">
        logout
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
export default {
  layout: 'startup',
  computed: {
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  },
  methods: {
    async logout () {
      // this.$axios.post('/auth/logout', {}, { withCredentials: true }).then(() => {
      //   this.$router.push('/')
      // })
      await this.$auth.logout({
        headers: {
          Authorization: this.$auth.strategy.token.get()
        }
      })
    }
  }
}
</script>
