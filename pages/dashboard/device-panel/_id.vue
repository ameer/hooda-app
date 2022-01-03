<template>
  <v-container class="h-100">
    <div class="text-center">
      <h4 class="text--primary mb-2">
        کنترل پنل هودا
      </h4>
    </div>
    <v-divider class="my-4" />
    <v-row align="center">
      <v-col v-if="Object.keys(device).length > 0" cols="12">
        <p class="text--primary mb-1 text-center">
          {{ deviceName }}
        </p>
        <p class="text--secondary font-weight-light text-center">
          {{ device.location ? device.location : 'محل نصب نامشخص' }}
        </p>
        <p class="text--primary mb-1 text-center">
          شماره سیمکارت داخل دستگاه: {{ device.sim_number }}
        </p>
      </v-col>
      <v-col cols="12">
        <v-switch
          v-model="powerState"
          inset

          :color="powerState === true ? 'green' : 'red'"
          :label="`وضعیت دستگاه: ${powerState ? 'فعال' : 'غیرفعال'}`"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <gauge :digit="temperature" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import gauge from '~/components/gauge.vue'
export default {
  components: { gauge },
  layout: 'dashboard',
  data () {
    return {
      loading: false,
      device: {},
      deviceData: {},
      timerId: null,
      powerState: false,
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
