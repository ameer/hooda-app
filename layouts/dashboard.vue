<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      right
      app
    >
      <user-avatar :user="user" />
      <v-divider class="mt-4" />
      <v-list class="">
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app color="#fbfbfd">
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
      <v-toolbar-title
        class="pr-0 font-weight-bold primary--text"
        v-text="title"
      />
      <v-spacer />
      <online-indicator />
      <v-btn elevation="0" small fab color="accent" @click="goBack">
        <v-icon color="primary">
          mdi-arrow-u-left-bottom
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="accent mb-8">
      <v-container class="h-100">
        <Nuxt />
      </v-container>
    </v-main>
    <v-bottom-navigation
      :class="isKeyboardShown ? 'keyboard-open' : ''"
      app
      color="primary"
      grow
      height="64"
    >
      <v-btn
        nuxt
        to="/dashboard/"
        exact
      >
        <v-icon large>
          mdi-home-outline
        </v-icon>
      </v-btn>

      <v-btn
        color="green"
        fab
        class="fab"
        to="/dashboard/add-device"
        nuxt
      >
        <v-icon color="white">
          mdi-plus
        </v-icon>
      </v-btn>

      <v-btn>
        <v-icon large>
          mdi-account-outline
        </v-icon>
      </v-btn>
    </v-bottom-navigation>
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { Storage } from '@capacitor/storage'
import OnlineIndicator from '~/components/onlineIndicator.vue'
import userAvatar from '~/components/userAvatar.vue'
export default {
  components: { userAvatar, OnlineIndicator },
  auth: false,
  middleware: 'authenticated',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-cellphone-link',
          title: 'دستگاه‌های من',
          to: '/'
        },
        {
          icon: 'mdi-share-variant-outline',
          title: 'معرفی به دوستان',
          to: '/'
        },
        {
          icon: 'mdi-phone-outline',
          title: 'ارتباط با ما',
          to: '/'
        },
        {
          icon: 'mdi-help',
          title: 'راهنما',
          to: '/'
        },
        {
          icon: 'mdi-cog-outline',
          title: 'تنظیمات',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'هــودا'
    }
  },
  computed: {
    user () {
      return this.$auth.user
    },
    isKeyboardShown () {
      return this.$store.state.isKeyboardShown
    }
  },
  async mounted () {
    const devices = await this.getDataFromLocal('devices')
    this.$store.commit('setDevices', devices)
  },
  created () {
    this.$nuxt.$on('getReq', this.getReq)
    this.$nuxt.$on('postReq', this.postReq)
    this.$nuxt.$on('saveDataToLocal', this.saveDataToLocal)
    this.$nuxt.$on('getDataFromLocal', this.getDataFromLocal)
    this.$nuxt.$on('getDeviceById', this.getDeviceById)
    this.$nuxt.$on('removeDataFromLocal', this.removeDataFromLocal)
    this.$nuxt.$on('updateUser', this.updateUser)
  },
  beforeDestroy () {
    this.$nuxt.$off('getReq', this.getReq)
    this.$nuxt.$off('postReq', this.postReq)
    this.$nuxt.$off('saveDataToLocal', this.saveDataToLocal)
    this.$nuxt.$off('getDataFromLocal', this.getDataFromLocal)
    this.$nuxt.$off('getDeviceById', this.getDeviceById)
    this.$nuxt.$off('removeDataFromLocal', this.removeDataFromLocal)
    this.$nuxt.$off('updateUser', this.updateUser)
  },
  methods: {
    goBack () {
      this.$router.back()
    },
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
    getReq (endpoint, event, options = { saveToLocal: false, saveToLocalKey: null }) {
      this.$axios
        .get(endpoint)
        .then((response) => {
          if (options.saveToLocal) {
            this.saveDataToLocal(options.saveToLocalKey, response.data)
          }
          this.$nuxt.$emit(event, response.data)
        })
        .catch((err) => {
          this.$nuxt.$emit('error')
          if (err.response) {
            const msg = err.response.data.message
            this.$toast.error(msg)
          } else {
            this.$toast.error('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.')
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
    updateUser (key, value) {
      const user = { ...this.$auth.user }
      user[key] = value
      this.$auth.setUser(user)
    },
    saveDeviceToLocal (device) {
      const devices = this.$store.state.devices
      devices.push(device)
      this.saveDataToLocal('devices', devices)
      this.$store.commit('setDevices', devices)
    },
    /*
    * Save data to capacitor storage
    * @param {string} key
    * @param {Object} value
    */
    async saveDataToLocal (key, value) {
      await Storage.set({
        key,
        value: JSON.stringify(value)
      })
    },
    /*
    * Get data from capacitor storage
    * @param {string} key
    * @return {Object} value
    */
    async getDataFromLocal (key, event = null) {
      const { value } = await Storage.get({ key })
      if (event) {
        this.$nuxt.$emit(event, JSON.parse(value))
      }
      return JSON.parse(value)
    },

    async getDeviceById (id, event = null) {
      const devices = await this.getDataFromLocal('devices')
      const device = devices.find(device => device.id === id)
      if (event) {
        this.$nuxt.$emit(event, { data: device })
      }
      return device
    },

    /*
    * Remove data from capacitor storage
    * @param {string} key
    */
    async removeDataFromLocal (key) {
      await Storage.remove({ key })
    }
  }
}
</script>
