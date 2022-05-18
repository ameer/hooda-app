<template>
  <v-container class="h-100 px-0">
    <device-card :device="device" :i="-1" />
    <transition-group
      name="slide-in"
      tag="div"
      class="row mt-4 align-stretch"
      :style="{ '--total': commands.length }"
    >
      <v-col
        v-for="(command, i) in commands"
        :key="`command-${i}`"
        cols="6"
        :style="{'--i': i}"
        @click="runCommand($store.getters['commands/getCommand'](command.name))"
      >
        <v-card class="main-box-shadow h-100" rounded="xl" min-height="163px">
          <div class="pt-4">
            <v-img :src="`/svg/commands-icons/${command.name}.svg`" contain max-height="85px" />
          </div>
          <v-card-text class="text-center">
            <span class="text-body-1 font-weight-bold">{{ $store.getters['i18n/getTranslate'](command.name) }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </transition-group>
  </v-container>
</template>
<script>
// import BatteryIndicator from '~/components/batteryIndicator.vue'
// import gauge from '~/components/gauge.vue'
import { SMS } from '@awesome-cordova-plugins/sms'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import deviceCard from '~/components/deviceCard.vue'
export default {
  components: { deviceCard },
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
  head () {
    return {
      title: 'پنل دستگاه'
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
    this.$nuxt.$emit('getDeviceById', this.$route.params.id, 'deviceRecieved')
    this.loading = true
    if ((this.device === null || this.device === undefined) && this.$store.state.onlineStatus) {
      this.$nuxt.$emit('postReq', `user/device/${this.$route.params.id}`, 'deviceRecieved')
    }
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
      this.checkAndSend(this.device.sim_number, command)
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
