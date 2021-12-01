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
    <!-- <v-app-bar fixed app elevation="0" color="#fbfbfd" class="justify-center">
      <v-app-bar-nav-icon
        class="absolute text--primary"
        @click.stop="drawer = !drawer"
      >
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
      <v-toolbar-title
        class="pr-0 font-weight-bold primary--text w-100 text-center"
      >
        <p class="mb-0">
          {{ title }}
        </p>
      </v-toolbar-title>
    </v-app-bar> -->
    <v-main class="accent h-full">
      <v-container fluid class="h-1/3 mt-4">
        <img src="/svg/signup.svg" width="100%" height="100%" @click="goFullScreen">
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
  created () {
    this.$nuxt.$on('postReq', this.postReq)
  },
  methods: {
    postReq (endpoint, event, data) {
      const self = this
      self.$axios.get('/csrf-cookie', { withCredentials: true })
      self.$axios
        .post(endpoint, data, { withCredentials: true })
        .then((resp) => {
          self.$nuxt.$emit(event, resp)
        })
        .catch((err) => {
          self.$nuxt.$emit('error', err)
        })
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
