<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      right
      app
    >
      <v-img
        src="/logo-fa-text-below.svg"
        contain
        max-width="85px"
        class="mx-auto mt-4"
      />
      <v-divider class="mt-4" />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app color="transparent" elevation="0">
      <v-app-bar-nav-icon class="text--primary" @click.stop="drawer = !drawer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            fill="rgb(0 0 0 / 87%)"
            d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z"
          />
        </svg>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-main class="accent h-full">
      <v-container fluid class="h-1/3">
        <img
          v-if="currentPage === 'auth-login'"
          src="/logo.svg"
          width="100%"
          height="100%"
          style="max-height:128px;"
          @click="goFullScreen"
        >
        <img v-else src="/svg/signup.svg" width="100%" height="100%" @click="goFullScreen">
      </v-container>
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
  middleware: ['authenticated'],
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-account-plus',
          title: 'ثبت نام',
          to: '/auth/signup'
        },
        {
          icon: 'mdi-login-variant',
          title: 'ورود',
          to: '/auth/login'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'هــودا'
    }
  },
  computed: {
    currentPage () {
      return this.$route.name
    }
  },
  created () {
    this.$nuxt.$on('postReq', this.postReq)
    this.$nuxt.$on('login', this.login)
    this.$nuxt.$on('userLoggedIn', () => {
      this.$toast.success(this.$auth.user.fullname + ' خوش آمدید')
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('postReq')
    this.$nuxt.$off('login')
    this.$nuxt.$off('userLoggedIn')
  },
  methods: {
    postReq (endpoint, event, data) {
      const self = this
      self.$axios
        .post(endpoint, data, { withCredentials: true })
        .then((resp) => {
          self.$nuxt.$emit(event, resp)
        })
        .catch((err) => {
          self.$nuxt.$emit('error')
          let msg = ''
          if ('errors' in err.response.data) {
            msg = self.errMsgGenerator(err.response.data.errors)
          } else {
            msg = err.response.data.message
          }
          self.$toast.error(msg)
        })
    },
    login (loginData) {
      this.$auth.loginWith('local', { data: loginData, timeout: 10000 }).then((resp) => {
        this.$auth.setUserToken(resp.data.token)
        this.$auth.setUser(resp.data.user)
        this.$auth.$storage.setUniversal('user', this.$auth.user)
        this.$router.push('/dashboard')
        this.$nuxt.$emit('userLoggedIn')
      }).catch((error) => {
        this.$nuxt.$emit('error')
        if (!error.response) {
          // network error
          this.$toast.error('خطا در اتصال به سرور. لطفا از اتصال خود به اینترنت مطمئن شوید')
        } else {
          this.$toast.error(error.response.data.message)
        }
      })
    },
    errMsgGenerator (errorsObject) {
      let msg = ''
      for (const key in errorsObject) {
        msg += errorsObject[key] + '\n'
      }
      return msg
    },
    goFullScreen () {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen()
      }
    }
  }
}
</script>
<style>
.main-height {
  height: calc(100vh - 56px);
}
#control-height {
  height: 100vh;
  width: 0;
  position: absolute;
}
</style>
