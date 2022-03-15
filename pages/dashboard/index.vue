<template>
  <v-container class="h-100 pa-0">
    <div class="text-h5 font-weight-bold text--secondary my-4 text-center">
      دستگاه‌های من
    </div>
    <v-row v-if="typeof devices === 'object' && devices.length > 0" align="start" justify="start" class="mt-4">
      <v-col
        v-for="(device, i) in devices"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          rounded="lg"
        >
          <v-card-text>
            <div class="text--secondary text--darken-1 text-body-1 text-center font-weight-bold mb-2">
              پایش امنیت هوشمند <span class="faNum">#{{ i+1 }}</span>
            </div>
            <v-row align="center">
              <v-col cols="6">
                <div class="text-center my-3">
                  <v-icon left color="accent darken-2">
                    mdi-map-marker-outline
                  </v-icon>
                  <div class="mt-2 font-weight-bold text-truncate">
                    {{ device.location }}
                  </div>
                </div>
              </v-col>
              <v-divider vertical inset />
              <v-col cols="6">
                <div class="text-center">
                  <v-icon left color="accent darken-2">
                    mdi-sim-outline
                  </v-icon>
                  <div class="mt-2 faNum font-weight-bold">
                    {{ device.sim_number }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="grey lighten-3">
            <v-btn
              color="primary"
              max-width="320px"
              class="mx-auto"
              outlined
              @click.prevent="setSelectedDevice(i, `/dashboard/device-panel/${device.id}`)"
            >
              <v-icon left>
                mdi-tune-vertical
              </v-icon>
              <span class="font-weight-bold text-body-2">پنل دستگاه</span>
            </v-btn>
            <v-spacer />
            <v-btn icon>
              <v-icon>
                mdi-square-edit-outline
              </v-icon>
            </v-btn>
          </v-card-actions>
          <!-- <v-card-title class="flex-column">
            <v-icon x-large color="primary lighten-2">
              mdi-shield-lock-outline
            </v-icon>
            <p class="text--primary mt-2 text-center">
              {{ device.location }}
            </p>
            <v-card-subtitle style="word-break: initial !important;">
              {{ deviceName[device.type] }}
            </v-card-subtitle>
          </v-card-title> -->
        </v-card>
      </v-col>
    </v-row>
    <div v-else>
      <p class="text-center">
        .دستگاهی برای نمایش وجود ندارد.
        برای افزودن دستگاه از دکمه + در پایین صفحه استفاده کنید.
      </p>
    </div>
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
  },
  methods: {
    setSelectedDevice (index, path) {
      this.$store.commit('setSelectedDevice', this.devices[index])
      this.$router.push(path)
    }
  }
}
</script>
<style>
</style>
