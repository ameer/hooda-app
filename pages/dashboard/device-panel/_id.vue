<template>
  <v-container class="h-100 px-0">
    <device-card :device="device" :i="-1" />
    <div class="d-flex align-center my-8">
      <div class="text-body-1">
        فرمان‌های پیامکی
      </div>
      <v-divider class="mx-2" />
    </div>
    <transition-group
      name="slide-in"
      tag="div"
      class="row align-stretch"
      :style="{ '--total': commands.length }"
    >
      <v-col
        v-for="(command, i) in commands"
        :key="`command-${i}`"
        cols="12"
        :style="{'--i': i}"
      >
        <CommandCard :command="command" @run="runCommand" />
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
import CommandCard from '~/components/commandCard.vue'
export default {
  components: { deviceCard, CommandCard },
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
      this.startWatching(command)
    },
    startWatching () {
      SmsRetriever.startWatching().then((res) => {
        this.$nuxt.$emit(`messageReceived-${this.command.name}`, res.Message)
      }).catch((err) => {
        // eslint-disable-next-line no-console
        this.$nuxt.$emit(`messageNotReceived-${this.command.name}`, err)
      })
    },
    sendSMS (number, command) {
      const self = this
      const message = this.$store.getters['commands/getCommand'](command.name)
      SMS.send(number, message, { android: { intent: '', slot: 0 } })
        .then(() => {
          self.$toast.success('پیامک با موفقیت ارسال شد.')
        })
        .catch((err) => {
          self.$toast.error('مشکلی در ارسال پیامک به وجود آمده است.' + err)
          this.$nuxt.$emit(`messageNotReceived-${command.name}`, err)
        })
    },
    checkAndSend (number, command) {
      const self = this
      const success = function (hasPermission) {
        if (hasPermission) {
          self.sendSMS(number, command)
        } else {
          AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.SEND_SMS).then(() => {
            self.sendSMS(number, command)
          }).catch((err) => {
            self.$toast.error(JSON.stringify(err))
            this.$nuxt.$emit(`messageNotReceived-${command.name}`, err)
          })
        }
      }
      const error = function (err) { this.$toast.error('Something went wrong:' + err); this.$nuxt.$emit(`messageNotReceived-${command.name}`, err) }
      SMS.hasPermission(success, error)
    }

  }
}
</script>
<style>

</style>
