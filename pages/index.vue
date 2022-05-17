<template>
  <v-container class="h-100">
    <v-row align="center" class="h-100">
      <v-col cols="12">
        <div :class="{'animate__animated animate__rotateIn' : animate}">
          <v-img src="/logo-dark-bg.svg" contain max-height="128px" />
        </div>

        <animated-text />
      </v-col>
      <v-col cols="12" class="text-center mt-auto">
        <div class="d-flex align-center justify-space-around justify-md-center">
          <v-btn
            rounded
            class="animate__animated animate__fadeInUp mx-md-8"
            color="accent"
            to="/auth/signup"
            max-width="120px"
            width="100%"
            large
          >
            <span class="primary--text font-weight-bold text-body-1">ثبت نام</span>
          </v-btn>
          <v-btn
            rounded
            class="animate__animated animate__fadeInUp mx-md-8"
            color="accent"
            to="/auth/login"
            max-width="120px"
            width="100%"
            large
          >
            <span class="primary--text font-weight-bold text-body-1">ورود</span>
          </v-btn>
        </div>
      </v-col>
      <!-- <v-btn v-if="isLoggedIn" @click="logout">
        logout
      </v-btn> -->
    </v-row>
  </v-container>
</template>
<script>
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
import { LocalNotifications } from '@capacitor/local-notifications'
import AnimatedText from '~/components/animatedText.vue'
export default {
  components: { AnimatedText },
  layout: 'startup',
  data () {
    return {
      animate: false
    }
  },
  computed: {
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  },
  mounted () {

  },
  created () {
    this.animate = true
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
