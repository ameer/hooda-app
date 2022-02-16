<template>
  <v-container class="h-100 pa-0">
    <h4 class="text--primary mb-4 text-center">
      دستگاه‌های من
    </h4>
    <v-row v-if="typeof devices === 'object' && devices.length > 0" align="start" justify="start" class="mt-4">
      <v-col
        v-for="(device, i) in devices"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        class="text-center"
      >
        <nuxt-link
          class="text-decoration-none"
          :to="`/dashboard/device-panel/${device.id}`"
        >
          <div class="img-container mb-4">
            <v-img contain :src="`/devices/${device.type}.svg`" />
          </div>
          <p class="text--primary mb-1 text-center">
            {{ deviceName[device.type] }}
          </p>
          <p class="text--secondary font-weight-light text-center">
            {{ device.location }}
          </p>
        </nuxt-link>
      </v-col>
    </v-row>
    <div v-else>
      <p class="text-center">
        .دستگاهی برای نمایش وجود ندارد.
        برای افزودن دستگاه از دکمه + در پایین صفحه استفاده کنید.
      </p>
    </div>
    <v-btn
      elevation="4"
      color="green"
      fab
      fixed
      class="fab bottom right"
      to="/dashboard/add-device"
      nuxt
    >
      <v-icon color="white">
        mdi-plus
      </v-icon>
    </v-btn>
  </v-container>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      devices: [],
      deviceName: ['پایش امنیت هوشمند', 'تشخیص دود هوشمند', 'دزدگیر هوشمند']
    }
  },
  fetch () {
    this.$nuxt.$emit('getDataFromLocal', 'devices', 'devicesReceived')
    if (this.$store.state.onlineStatus) {
      this.$nuxt.$emit('getReq', 'user/devices', 'devicesReceived', { saveToLocal: true, saveToLocalKey: 'devices' })
    }
  },
  created () {
    this.$nuxt.$on('devicesReceived', (devices) => {
      this.devices = devices
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('devicesReceived')
  }
}
</script>
<style>
</style>
