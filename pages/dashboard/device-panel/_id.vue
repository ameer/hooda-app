<template>
  <v-container class="h-100 px-0">
    <v-card>
      <v-card-text class="px-4 mb-4">
        <v-row align="center">
          <v-col v-if="Object.keys(device).length > 0" cols="12">
            <p class="text--primary mb-1">
              {{ deviceName }}
              <span class="text--secondary font-weight-light">
                {{ device.location ? device.location : 'محل نصب نامشخص' }}
              </span>
            </p>
            <p class="text--primary mb-1">
              <span class="text--secondary font-weight-light">
                شماره سیمکارت داخل دستگاه:
              </span>
              {{ device.sim_number }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-4">
      <v-card-text class="py-0 px-4">
        <v-row align="center" no-gutters>
          <v-col cols="12">
            <v-switch
              v-model="powerState"
              inset
              hide-details="auto"
              :color="powerState === true ? 'green' : 'red'"
              :label="`وضعیت دستگاه: ${powerState ? 'فعال' : 'غیرفعال'}`"
            />
          </v-col>
          <v-col cols="6" class="d-flex align-center">
            <span class="mb-0 text-body-2 ml-4">
              شارژ باتری:
            </span>
            <battery-indicator :battery-charge="batteryCharge" />
          </v-col>
          <v-col cols="6" />
        </v-row>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12">
        <gauge :digit="temperature" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import BatteryIndicator from '~/components/batteryIndicator.vue'
import gauge from '~/components/gauge.vue'
export default {
  components: { gauge, BatteryIndicator },
  layout: 'dashboard',
  data () {
    return {
      loading: false,
      device: {},
      deviceData: {},
      timerId: null,
      powerState: true,
      items: [
        {
          title: 'پایش امنیت هوشمند'
        },
        {
          title: 'تشخیص دود هوشمند'
        },
        {
          title: 'دزدگیر هوشمند'
        }
      ]
    }
  },
  fetch () {
    this.loading = true
    this.$nuxt.$emit('postReq', `user/device/${this.$route.params.id}`, 'deviceRecieved')
  },
  computed: {
    deviceName () {
      if ('type' in this.device) {
        return this.items[this.device.type].title
      } else {
        return ''
      }
    },
    temperature () {
      if ('ntc' in this.deviceData) {
        return this.deviceData.ntc
      } else {
        return 0
      }
    },
    batteryCharge () {
      if ('bv' in this.deviceData) {
        return this.deviceData.bv
      } else {
        return 0
      }
    }
  },
  mounted () {
    const self = this
    self.getDeviceData()
    self.timerId = setInterval(self.getDeviceData, 20000)
  },
  created () {
    this.$nuxt.$on('error', () => {
      clearInterval(this.timerId)
    })
    this.$nuxt.$on('deviceRecieved', (resp) => {
      this.loading = false
      this.device = resp.data
    })
    this.$nuxt.$on('deviceDataRecieved', (resp) => {
      this.deviceData = resp.data
    })
  },
  beforeDestroy () {
    clearInterval(this.timerId)
    this.$nuxt.$off('deviceRecieved')
    this.$nuxt.$off('deviceDataRecieved')
    this.$nuxt.$off('error')
  },
  methods: {
    getDeviceData () {
      this.$nuxt.$emit('postReq', `user/device/${this.$route.params.id}/data`, 'deviceDataRecieved')
    }
  }
}
</script>
<style>

</style>
