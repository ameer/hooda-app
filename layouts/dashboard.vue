<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      right
      app
    >
      <user-avatar :user="user" />
      <v-divider class="mt-4" />
      <v-list class="">
        <template v-for="(item, i) in items">
          <v-list-item v-if="item.isLink" :key="`side-nav-link-${i}`" :to="`/dashboard/${item.to}`" nuxt exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else :key="`side-nav-btn-${i}`" @click="item.action">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'خروج'" />
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
      <!-- <v-btn elevation="0" small fab color="accent" @click="goBack">
        <v-icon color="primary">
          mdi-arrow-u-left-bottom
        </v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main class="accent" style="padding-bottom:128px;">
      <div v-show="isScanning" id="scanner-frame" />
      <v-alert v-if="needsUpdate" type="info" tile class="mb-0" icon="mdi-update">
        <div class="d-flex">
          بروزرسانی در دسترس است.
          <v-spacer />
          <v-btn small color="success" href="https://api.hoodaiot.ir/app/latest.apk" target="_blank" rounded>
            بروزرسانی
          </v-btn>
        </div>
      </v-alert>
      <v-container id="main-container" class="h-100">
        <Nuxt />
      </v-container>
    </v-main>
    <div id="mobile-nav" :class="isKeyboardShown ? 'keyboard-open' : ''" class="d-flex d-md-none">
      <v-container id="mobile-nav-menu-container">
        <v-row align="center" justify="space-around" class="flex-wrap">
          <template v-for="(btn, i) in mobileNavItems">
            <v-btn
              v-if="btn.isLink"
              :key="`mobile-nav-item-${i}`"
              :large="btn.isCenter"
              fab
              dark
              :elevation="btn.isCenter ? 4 : 0"
              color="#006090"
              :class="{'center-fab' : btn.isCenter}"
              :to="`/dashboard/${btn.isCenter && isDashboard ? btn.dashboardIcon.to : btn.to}`"
              exact
            >
              <v-icon style="font-size:30px">
                {{ btn.isCenter && isDashboard ? btn.dashboardIcon.icon : btn.icon }}
              </v-icon>
            </v-btn>
            <v-btn
              v-else
              :key="`mobile-nav-button-${i}`"
              :large="btn.isCenter"
              fab
              dark
              :elevation="btn.isCenter ? 4 : 0"
              color="#006090"
              :class="{'center-fab' : btn.isCenter}"
              @click="btn.action"
            >
              <v-icon style="font-size:30px">
                {{ btn.isCenter && isDashboard ? btn.dashboardIcon.icon : btn.icon }}
              </v-icon>
            </v-btn>
          </template>
        </v-row>
      </v-container>
      <div class="mobile_navigation_bg">
        <svg class="footersvgmobileholder" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64"><path d="M0,0H104a31.55,31.55,0,0,1,25.45,12.91l6.2,8.48a30.17,30.17,0,0,0,48.7,0l6.2-8.48A31.55,31.55,0,0,1,216,0H320V64H0Z" /></svg>
      </div>
    </div>
  </v-app>
</template>

<script>
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { Storage } from '@capacitor/storage'
import OnlineIndicator from '~/components/onlineIndicator.vue'
import userAvatar from '~/components/userAvatar.vue'
export default {
  components: { userAvatar, OnlineIndicator },
  auth: false,
  middleware: 'authenticated',
  data () {
    return {
      drawer: false,
      title: 'هــودا',
      items: [
        {
          icon: 'mdi-account',
          title: 'ویرایش اطلاعات کاربری',
          to: 'user/edit-profile',
          isLink: true
        },
        {
          icon: 'mdi-headset',
          title: 'ارتباط با ما',
          to: '/',
          isLink: true
        },
        {
          dashboardIcon: {
            icon: 'mdi-plus',
            title: 'افزودن دستگاه',
            to: 'add-device'
          },
          icon: 'mdi-home',
          title: 'دستگاه‌های من',
          isCenter: true,
          to: '',
          isLink: true
        },
        {
          icon: 'mdi-help',
          title: 'راهنما',
          to: 'guides',
          isLink: true
        },
        {
          icon: 'mdi-share-variant',
          title: 'معرفی به دوستان',
          isLink: false,
          action: this.share
        }
      ]
    }
  },
  computed: {
    isScanning () {
      return this.$store.state.isScanningBarcode
    },
    isDashboard () {
      return this.$route.name === 'dashboard'
    },
    user () {
      return this.$auth.user ? this.$auth.user : {}
    },
    isKeyboardShown () {
      return this.$store.state.isKeyboardShown
    },
    mobileNavItems () {
      return this.items.filter(item => !item.sidebarOnly)
    },
    needsUpdate () {
      return this.$store.state.needsUpdate
    }
  },
  async mounted () {
    this.$store.dispatch('checkNeedsUpdate', this)
    this.$store.commit('setPlatform', Capacitor.getPlatform())
    const devices = await this.getDataFromLocal('devices')
    this.$store.commit('setDevices', devices)
  },
  created () {
    this.$nuxt.$on('getReq', this.getReq)
    this.$nuxt.$on('postReq', this.postReq)
    this.$nuxt.$on('putReq', this.putReq)
    this.$nuxt.$on('deleteReq', this.deleteReq)
    this.$nuxt.$on('saveDeviceToLocal', this.saveDeviceToLocal)
    this.$nuxt.$on('removeDeviceFromLocal', this.removeDeviceFromLocal)
    this.$nuxt.$on('saveDataToLocal', this.saveDataToLocal)
    this.$nuxt.$on('getDataFromLocal', this.getDataFromLocal)
    this.$nuxt.$on('getDeviceById', this.getDeviceById)
    this.$nuxt.$on('removeDataFromLocal', this.removeDataFromLocal)
    this.$nuxt.$on('updateUser', this.updateUser)
  },
  beforeDestroy () {
    this.$nuxt.$off('getReq', this.getReq)
    this.$nuxt.$off('postReq', this.postReq)
    this.$nuxt.$off('putReq', this.putReq)
    this.$nuxt.$off('deleteReq', this.deleteReq)
    this.$nuxt.$off('saveDeviceToLocal', this.saveDeviceToLocal)
    this.$nuxt.$off('removeDeviceFromLocal', this.removeDeviceFromLocal)
    this.$nuxt.$off('saveDataToLocal', this.saveDataToLocal)
    this.$nuxt.$off('getDataFromLocal', this.getDataFromLocal)
    this.$nuxt.$off('getDeviceById', this.getDeviceById)
    this.$nuxt.$off('removeDataFromLocal', this.removeDataFromLocal)
    this.$nuxt.$off('updateUser', this.updateUser)
  },
  methods: {
    async share () {
      try {
        await Share.share({
          title: 'معرفی به دوستان',
          text: 'اپلیکیشن کاربردی هودا برای مدیریت اولین دزدگیر دتکتور هوشمند و گجتی در ایران. برای دریافت اپلیکیشن روی لینک زیر بزنید',
          url: 'https://hoodaiot.ir',
          dialogTitle: 'اشتراک‌گذاری اپلیکیشن'
        })
      } catch (error) {
        if (error.message.includes('canceled')) {
          console.log('Share cancelled')
        } else {
          this.$toast.error(error.message)
        }
      }
    },
    logout () {
      this.$auth.$storage.removeUniversal('user')
      this.$auth.logout()
    },
    goBack () {
      this.$router.back()
    },
    setLoading (value) {
      this.$store.commit('setLoading', value)
    },
    postReq (endpoint, event, data) {
      const self = this
      self.setLoading(true)
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
        }).finally(() => {
          self.setLoading(false)
        })
    },
    putReq (endpoint, event, data) {
      const self = this
      self.setLoading(true)
      self.$axios
        .put(endpoint, data, { withCredentials: true })
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
        }).finally(() => {
          self.setLoading(false)
        })
    },
    getReq (endpoint, event, options = { saveToLocal: false, saveToLocalKey: null }) {
      const self = this
      self.setLoading(true)
      self.$axios
        .get(endpoint)
        .then((response) => {
          if (options.saveToLocal) {
            self.saveDataToLocal(options.saveToLocalKey, response.data)
          }
          self.$nuxt.$emit(event, response.data)
        })
        .catch((err) => {
          self.$nuxt.$emit('error')
          if (err.response) {
            const msg = err.response.data.message
            self.$toast.error(msg)
          } else {
            self.$toast.error('خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.')
          }
        }).finally(() => {
          self.setLoading(false)
        })
    },
    deleteReq (endpoint, event) {
      const self = this
      self.setLoading(true)
      self.$axios
        .delete(endpoint)
        .then((response) => {
          self.$nuxt.$emit(event, response.data)
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
        }).finally(() => {
          self.setLoading(false)
        })
    },
    errMsgGenerator (errorsObject) {
      let msg = ''
      for (const key in errorsObject) {
        msg += errorsObject[key] + '\n'
      }
      return msg
    },
    updateUser (key, value, replaceAll = false, user = {}) {
      if (replaceAll) {
        this.$auth.$storage.setUniversal('user', user)
        this.$auth.setUser(user)
      } else {
        const user = { ...this.$auth.user }
        user[key] = value
        this.$auth.$storage.setUniversal('user', user)
        this.$auth.setUser(user)
      }
    },
    async saveDeviceToLocal (device) {
      await this.$store.commit('updateDevicesList', device)
      const devices = this.$store.state.devices
      this.saveDataToLocal('devices', devices)
    },
    async removeDeviceFromLocal (deviceUUID) {
      await this.$store.commit('removeDeviceFromList', deviceUUID)
      const devices = this.$store.state.devices
      this.saveDataToLocal('devices', devices)
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

    async getDeviceById (uuid, event = null) {
      const devices = await this.getDataFromLocal('devices')
      const device = devices[uuid]
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
