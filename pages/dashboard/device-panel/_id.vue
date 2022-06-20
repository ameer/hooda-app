<template>
  <v-container class="h-100 px-0">
    <device-card :device="device" :i="-1" :show-device-response="showDeviceResponse" :device-response="deviceResponse" />
    <v-card v-if="canAddNewAdmin" class="device-card mt-4" rounded="xl">
      <add-admin-to-device
        :admin-index="device.countOfDeviceUsers"
        :dialog="addAdminDialog"
        :device-id="$route.params.id"
        @closeDialog="addAdminDialog = false"
        @updateDevice="updateDevice"
        @sendAdminSMS="sendAdminSMS"
      />
      <remove-admin-from-device
        :dialog="removeAdminDialog"
        :device-id="$route.params.id"
        @closeDialog="removeAdminDialog = false"
        @updateDevice="updateDevice"
        @sendRemoveAdminSMS="sendRemoveAdminSMS"
      />
      <change-device-password
        :dialog="changeDevicePasswordDialog"
        :device-id="$route.params.id"
        @closeDialog="changeDevicePasswordDialog = false"
        @updateDevice="updateDevice"
        @sendChangePasswordSMS="sendChangePasswordSMS"
      />
      <v-card-text>
        <p class="text-body-1">
          این دستگاه در حال حاضر <span class="faNum font-weight-bold">{{ device.countOfDeviceUsers }}</span> مدیر دارد.
        </p>
        <v-btn rounded color="primary" large class="mr-auto d-block" @click="addAdminDialog = true">
          افزودن مدیر به دستگاه
        </v-btn>
      </v-card-text>
    </v-card>
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
        <CommandCard v-if="!command.isAction" :command="command" @run="runCommand" />
        <CommandCard v-else :command="command" :special-command="true" @runSpecialCommand="handleSpecialCommand" />
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
import AddAdminToDevice from '~/components/dialogs/addAdminToDevice.vue'
import RemoveAdminFromDevice from '~/components/dialogs/removeAdminFromDevice.vue'
import ChangeDevicePassword from '~/components/dialogs/changeDevicePassword.vue'
export default {
  components: { deviceCard, CommandCard, AddAdminToDevice, RemoveAdminFromDevice, ChangeDevicePassword },
  // components: { gauge, BatteryIndicator },
  layout: 'dashboard',
  data () {
    return {
      addAdminDialog: false,
      removeAdminDialog: false,
      changeDevicePasswordDialog: false,
      loading: false,
      showDeviceResponse: true,
      deviceResponse: '',
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
    canAddNewAdmin () {
      return this.device.countOfDeviceUsers < 3 && this.device.pivot.role === 1
    },
    appHash () {
      return this.$store.state.appHash
    },
    simCardSlot () {
      return this.$auth.user.simCardSlot ? this.$auth.user.simCardSlot : 0
    }
  },
  mounted () {
    // const self = this
    // self.getDeviceData()
    // self.timerId = setInterval(self.getDeviceData, 20000)
    this.$store.dispatch('getAppHash')
    this.$nuxt.$emit('getDeviceById', this.$route.params.id, 'deviceRecieved')
    this.loading = true
    if (this.$store.state.onlineStatus) {
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
      this.$store.dispatch('commands/setPassword', this.device.psw)
      this.commands = this.$store.getters['commands/getUserCommands']()
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
      this.deviceResponse = ''
      const self = this
      console.log(self.$store.getters['commands/getCommand'](command))
      this.checkAndSend(this.device.sim_number, command)
      this.startWatching()
    },
    startWatching () {
      this.$store.dispatch('watchingForSMS', true)
      SmsRetriever.startWatching().then((res) => {
        this.deviceResponse = res.Message.replace(this.appHash, '')
        this.scrollIntoView('device-response')
      }).catch((err) => {
        // eslint-disable-next-line no-console
        this.deviceResponse = err
      }).finally(() => {
        this.$store.dispatch('watchingForSMS', false)
      })
    },
    sendSMS (number, command) {
      const self = this
      const message = self.$store.getters['commands/getCommand'](command) // + '\n' + self.appHash // For next version
      SMS.send(number, message, { android: { intent: '', slot: self.simCardSlot } })
        .then(() => {
          self.$toast.success('پیامک با موفقیت ارسال شد.')
        })
        .catch((err) => {
          self.$toast.error('مشکلی در ارسال پیامک به وجود آمده است.' + err)
        }).finally(() => {
          this.$store.dispatch('watchingForSMS', false)
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
          }).finally(() => {
            this.$store.dispatch('watchingForSMS', false)
          })
        }
      }
      const error = function (err) { this.$toast.error('Something went wrong:' + err); this.$nuxt.$emit(`messageNotReceived-${command.name}`, err) }
      SMS.hasPermission(success, error)
    },
    updateDevice (device) {
      this.device = device
    },
    sendAdminSMS (adminPhone) {
      this.runCommand({ name: 'setAdmin', adminIndex: this.device.countOfDeviceUsers, adminPhone })
    },
    sendRemoveAdminSMS (adminIndex, adminPhone) {
      this.runCommand({ name: 'removeAdmin', adminIndex, adminPhone })
    },
    sendChangePasswordSMS (password) {
      this.runCommand({ name: 'changeDevicePassword', password })
    },
    handleSpecialCommand (command) {
      switch (command.action) {
        case 'removeAdmin':
          this.removeAdminDialog = true
          break
        case 'changeDevicePassword':
          this.changeDevicePasswordDialog = true
          break
      }
    },
    scrollIntoView (id) {
      const el = document.getElementById(id)
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
</script>
<style>

</style>
