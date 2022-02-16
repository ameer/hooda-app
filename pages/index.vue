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
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
import { LocalNotifications } from '@capacitor/local-notifications'
export default {
  layout: 'startup',
  computed: {
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  },
  mounted () {

  },
  methods: {
    async logout () {
      await this.$auth.logout({
        headers: {
          Authorization: this.$auth.strategy.token.get()
        }
      })
    },
    getAppHash () {
      SmsRetriever.getAppHash().then((res) => {
        alert(res)
      }).catch((err) => {
        alert(err)
      })
    },
    startWatching () {
      SmsRetriever.startWatching().then((res) => {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'هشدار دستگاه',
              body: res.Message,
              id: 503,
              schedule: {
                at: Date.now()
              }
            }
          ]
        })
      }).catch((err) => {
        alert(err)
      })
    }
  }
}
</script>
