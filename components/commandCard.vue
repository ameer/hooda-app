<template>
  <v-card class="main-box-shadow h-100  overflow-hidden" rounded="xl" @click="handleClickOnCard">
    <confirm-action
      :dialog="confirmDialog"
      :dialog-message="dialogMessage"
      :dialog-title="dialogTitle"
      :switch-buttons="true"
      @closeDialog="closeConfirmDialog"
      @actionConfirmed="actionConfirmed"
    />
    <v-card-text class="h-100 py-2 relative">
      <v-container class="h-100" fluid>
        <v-row align="center" class="h-100">
          <v-col cols="3" class="pr-0">
            <v-img :src="`/svg/commands-icons/${command.name}.svg`" contain max-height="64px" eager />
          </v-col>
          <v-col cols="6" class="pr-0">
            <div class="text-body-1 font-weight-bold">
              {{ $store.getters['i18n/getTranslate'](command.name) }}
            </div>
          </v-col>
          <transition name="slide-y-reverse-transition">
            <v-col v-if="command.needsInternet && !online" cols="12">
              <v-alert
                dense
                outlined
                type="error"
              >
                این فرمان نیازمند دسترسی به اینترنت است. لطفا دیتای موبایل یا WiFi تلفن همراه خود را متصل کنید.
              </v-alert>
            </v-col>
          </transition>
        </v-row>
      </v-container>
      <div v-if="!specialCommand" class="confirm-btn" :class="{'active': active}" @click.stop="handleActionButtonClick">
        <div v-show="!loading" class="text-body-2 white--text">
          ارسال پیامک
        </div>
        <v-progress-circular
          v-show="loading"
          indeterminate
          color="white"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import confirmAction from './dialogs/confirmAction.vue'
export default {
  components: { confirmAction },
  props: {
    command: {
      type: Object,
      required: true,
      default: () => ({})
    },
    specialCommand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      confirmDialog: false,
      dialogMessage: '',
      dialogTitle: '',
      active: false,
      message: '',
      loading: false
    }
  },
  computed: {
    appHash () {
      return this.$store.state.appHash
    },
    isWatchingForSMS () {
      return this.$store.state.isWatchingForSMS
    },
    online () {
      return this.$store.state.onlineStatus
    }
  },
  watch: {
    isWatchingForSMS (val) {
      if (!val) {
        this.active = false
        this.loading = false
      }
    }
  },
  created () {
    this.$nuxt.$on(`messageReceived-${this.command.name}`, (message) => {
      this.active = false
      this.message = message.replace(this.appHash, '')
    })
    this.$nuxt.$on(`messageNotReceived-${this.command.name}`, (err) => {
      this.active = false
      this.message = err
    })
  },
  beforeDestroy () {
    this.$nuxt.$off(`messageReceived-${this.command.name}`)
    this.$nuxt.$off(`messageNotReceived-${this.command.name}`)
  },
  methods: {
    handleClickOnCard () {
      if (this.command.needsInternet && !this.online) {
        return false
      }
      if (this.specialCommand) {
        this.$emit('runSpecialCommand', this.command)
      } else {
        this.toggleActive()
      }
    },
    toggleActive () {
      this.active = !this.active
    },
    handleActionButtonClick () {
      if (this.command.needConfirm) {
        this.confirmDialog = true
        this.dialogMessage = this.command.confirmMessage
        this.dialogTitle = this.command.confirmTitle
      } else {
        this.runCommand(this.command)
      }
    },
    runCommand (command) {
      if (!this.isWatchingForSMS) {
        this.loading = true
        this.message = ''
        this.$emit('run', command)
      } else {
        this.$toast.error('برنامه در انتظار دریافت پیامک است. لطفاْ چند لحظه بعد تلاش کنید.')
        this.active = false
        this.loading = false
      }
    },
    actionConfirmed () {
      this.runCommand(this.command)
      this.closeConfirmDialog()
    },
    closeConfirmDialog () {
      this.loading = false
      this.confirmDialog = false
    }
  }
}
</script>
<style>

</style>
