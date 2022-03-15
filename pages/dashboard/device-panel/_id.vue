<template>
  <v-container class="h-100 px-0">
    <v-card>
      <v-card-text class="px-4 mb-4">
        <v-row align="center">
          <v-col v-if="device !== null" cols="12">
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
      <v-card-title>
        پنل فرمان دستگاه
      </v-card-title>
      <v-card-text class="py-0 px-4">
        <v-btn
          v-for="(command, i) in commands"
          :key="`command-${i}`"
          color="primary"
          block
          class="mb-4"
          @click="runCommand(command.value)"
        >
          {{ command.name }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
// import BatteryIndicator from '~/components/batteryIndicator.vue'
// import gauge from '~/components/gauge.vue'
import { SMS } from '@awesome-cordova-plugins/sms'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
export default {
  // components: { gauge, BatteryIndicator },
  layout: 'dashboard',
  data () {
    return {
      loading: false,
      commands: [],
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
    this.device = this.$store.state.selectedDevice
    if (this.device === null && this.$store.state.onlineStatus) {
      this.$nuxt.$emit('postReq', `user/device/${this.$route.params.id}`, 'deviceRecieved')
    }
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
    // const self = this
    // self.getDeviceData()
    // self.timerId = setInterval(self.getDeviceData, 20000)
    this.commands = this.$store.getters['commands/getUserCommands']()
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
    },
    runCommand (command) {
      this.checkAndSend('09058263061', command)
      this.startWatching()
    },
    startWatching () {
      SmsRetriever.startWatching().then((res) => {
        alert(res.Message)
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
    },
    sendSMS (number, message) {
      const self = this
      SMS.send(number, message, { android: { intent: '', slot: 1 } })
        .then(() => {
          self.$toast.success('پیامک با موفقیت ارسال شد.')
        })
        .catch((err) => {
          self.$toast.error('مشکلی در ارسال پیامک به وجود آمده است.' + err)
        })
    },
    checkAndSend (number, message) {
      const self = this
      const success = function (hasPermission) {
        if (hasPermission) {
          self.sendSMS(number, message)
        } else {
          AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.SEND_SMS).then(() => {
            self.sendSMS(number, message)
          }).catch((err) => {
            self.$toast.error(JSON.stringify(err))
          })
        }
      }
      const error = function (e) { this.$toast.error('Something went wrong:' + e) }
      SMS.hasPermission(success, error)
    }
  }
}
</script>
<style>

</style>
