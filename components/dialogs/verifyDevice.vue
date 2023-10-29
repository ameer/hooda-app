<template>
  <v-dialog
    :value="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card color="accent">
      <v-toolbar
        dark
        color="primary"
        tile
      >
        <v-btn
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>تایید افزودن دستگاه</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="px-0">
          <v-row justify="center">
            <v-col cols="12" md="6" class="faNum px-2">
              <v-stepper v-model="step" flat tile elevation="0" class="accent">
                <v-stepper-header
                  class="elevation-0 align-start justify-center hide-divider accent"
                >
                  <v-stepper-step
                    color="primary lighten-1"
                    complete-icon=""
                    step=""
                    :complete="step === 1"
                  />
                  <v-divider />
                  <v-stepper-step
                    color="primary lighten-1"
                    complete-icon=""
                    step=""
                    :complete="step === 2"
                  />
                  <v-divider />
                  <v-stepper-step
                    color="primary lighten-1"
                    complete-icon=""
                    step=""
                    :complete="step === 3"
                  />
                </v-stepper-header>
                <v-stepper-items class="accent">
                  <v-stepper-content step="1" class="px-0">
                    <div>
                      <p class="text-body-1">
                        در این مرحله شماره‌ی زیر به عنوان مدیر اصلی در حافظه دستگاه ثبت خواهد شد.
                      </p>
                      <span class="d-block faNum font-weight-bold primary--text my-4 text-center" style="font-size:2rem;">
                        {{ firstAdminNumber }}
                      </span>
                      <div v-if="isDualSim">
                        <div v-if="typeof user.simCardSlot === 'undefined'" class="text-body-1">
                          با توجه به اینکه از این پس کلیه ارتباطات با دستگاه از طریق این شماره خواهد بود، لطفا انتخاب کنید این شماره مربوط به کدام سیم کارت است:
                          <v-form ref="dualSimForm" v-model="dualSimFormValid" @submit.prevent="submitDualSimForm">
                            <v-radio-group v-model="selectedSim" class="px-4" :rules="[rules.required]">
                              <v-radio
                                v-for="(sim,i) in simInfo.cards"
                                :key="i"
                                class="mb-4"
                                :label="`سیم کارت ${i+1} (${sim.displayName})`"
                                :value="i + 1"
                              />
                            </v-radio-group>
                            <v-btn
                              block
                              :disabled="!dualSimFormValid"
                              type="submit"
                              x-large
                              class="mb-4 mx-auto d-block"
                              color="primary"
                              rounded
                            >
                              مرحله بعد
                            </v-btn>
                          </v-form>
                        </div>
                        <p v-else class="text-body-1">
                          پیامک تایید از طریق سیمکارت <span class="faNum">{{ user.simCardSlot }}</span> ارسال می شود.
                        </p>
                      </div>
                    </div>
                  </v-stepper-content>
                  <v-stepper-content step="2" class="px-0">
                    <p class="text-body-1">
                      یک پیامک جهت ثبت شماره شما به دستگاه ارسال شده است. لطفا تا زمان دریافت پیامک تایید صبر کنید.
                    </p>
                    <div class="spinner">
                      <div class="rect1" />
                      <div class="rect2" />
                      <div class="rect3" />
                      <div class="rect4" />
                      <div class="rect5" />
                    </div>
                  </v-stepper-content>
                  <v-stepper-content step="3" class="px-0">
                    <p class="text-body-1 mb-4">
                      شماره شما با موفقیت به عنوان مدیر اصلی در حافظه دستگاه ثبت شد.
                    </p>
                    <p class="text-body-1">
                      در صورت تمایل می‌توانید این دستگاه را با سرور نگهبان هوشمند همگام سازی نمایید تا در صورت تعویض تلفن همراه یا پاک شدن برنامه، نیازی به تنظیم مجدد دستگاه نداشته باشید.
                    </p>
                    <v-btn color="success" block x-large rounded>
                      همگام سازی با سرور نگهبان هوشمند
                    </v-btn>
                    <v-divider class="my-4" />
                    <v-btn color="secondary" block x-large rounded>
                      پایان فرآیند
                    </v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { SMS } from '@awesome-cordova-plugins/sms'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
export default {
  props: {
    isDualSim: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: false
    },
    simInfo: {
      type: Object,
      default: () => {}
    },
    deviceSimNumber: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dualSimFormValid: true,
      step: 1,
      selectedSim: null,
      rules: {
        required: v => !!v || 'لطفاً یک مورد را انتخاب کنید'
      }
    }
  },
  computed: {
    firstAdminNumber () {
      return this.$auth.user.phone
    },
    setAdminCommand () {
      const command = this.$store.getters['commands/getCommand']('setAdmin', 1)
      return command.replace('$mobile', this.firstAdminNumber)
    },
    selectedSlot () {
      if (this.isDualSim) {
        if (typeof this.user.simCardSlot === 'undefined') {
          return this.selectedSim - 1
        } else {
          return this.user.simCardSlot
        }
      } else {
        return 0
      }
    },
    user () {
      return this.$auth.user
    }
  },
  mounted () {
    this.$store.commit('commands/setCurrentPassword', '0000')
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    submitDualSimForm () {
      if (!this.$refs.dualSimForm.validate()) { return false }
      this.$emit('setSimCardSlot', this.selectedSlot)
      this.sendSMS(this.deviceSimNumber, this.setAdminCommand)
      this.step = 2
      this.startWatching()
    },
    startWatching () {
      SmsRetriever.startWatching().then((res) => {
        this.$emit('saveDeviceToLocal')
        this.step = 3
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
    },
    sendSMS (number, message) {
      const self = this
      SMS.send(number, message, { android: { intent: '', slot: this.selectedSlot } })
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
