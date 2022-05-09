<template>
  <v-container class="h-100 pa-0">
    <div class="text-h5 font-weight-bold text--secondary mt-4 mb-2 text-center">
      دستگاه‌های من
    </div>
    <transition name="fade-transition">
      <div v-show="offlineDataWarning" class="orange--text text--accent-4 text-center">
        <span style="vertical-align:top;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path fill="#FF6D00" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" /></svg></span>
        فهرست دستگاه‌ها بروز نیست.
      </div>
    </transition>
    <transition-group
      name="slide-in"
      tag="div"
      class="row mt-4 align-start justify-start"
      :style="{ '--total': devices.length }"
    >
      <v-col
        v-for="(device, i) in devices"
        :key="`device-${i}`"
        cols="12"
        :style="{'--i': i}"
      >
        <device-card :device="device" :i="i" />
      </v-col>
    </transition-group>
    <div v-if="!devices.length > 0">
      <p class="text-center">
        .دستگاهی برای نمایش وجود ندارد. برای افزودن دستگاه از دکمه + در پایین
        صفحه استفاده کنید.
      </p>
    </div>
  </v-container>
</template>
<script>
import deviceCard from '~/components/deviceCard.vue'
export default {
  components: { deviceCard },
  layout: 'dashboard',
  data () {
    return {
      devices: [],
      deviceName: ['پایش امنیت هوشمند', 'تشخیص دود هوشمند', 'دزدگیر هوشمند'],
      offlineDataWarning: false
    }
  },
  fetch () {
    if (this.$store.state.onlineStatus) {
      this.$nuxt.$emit('getReq', 'user/devices', 'devicesReceived', {
        saveToLocal: true,
        saveToLocalKey: 'devices'
      })
    } else {
      this.$nuxt.$emit('getDataFromLocal', 'devices', 'devicesReceived')
    }
  },
  head () {
    return {
      title: 'داشبورد'
    }
  },
  created () {
    this.$nuxt.$on('devicesReceived', (devices) => {
      this.$nextTick(() => {
        this.devices = devices
      })
    })
    this.$nuxt.$on('error', () => { // network error
      this.offlineDataWarning = true
      this.$nuxt.$emit('getDataFromLocal', 'devices', 'devicesReceived')
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('devicesReceived')
    this.$nuxt.$off('error')
  },
  methods: {
    setSelectedDevice (index, path) {
      this.$store.commit('setSelectedDevice', this.devices[index])
      this.$router.push(path)
    }
  }
}
</script>
<style></style>
