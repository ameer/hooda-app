/* eslint-disable no-console */
<template>
  <v-container>
    <h4 class="text--primary mb-4 text-center">
      {{ stepTitle }}
    </h4>
    <v-row align="center" justify="center" class="mt-4">
      <v-col cols="12" md="4">
        <v-stepper v-model="step" flat tile elevation="0" class="accent">
          <v-stepper-header
            class="elevation-0 align-start justify-center hide-divider accent"
          >
            <v-stepper-step
              v-for="(stepper) in numberOfSteps"
              :key="stepper"
              color="primary lighten-1"
              complete-icon=""
              step=""
              :complete="step === stepper"
            />
          </v-stepper-header>
          <v-stepper-items class="accent">
            <v-stepper-content step="1" class="px-0">
              <v-form ref="checkDeviceForm" v-model="valid.checkDeviceForm" class="pt-4" @submit.prevent="checkDevice">
                <v-text-field
                  v-model="formData.serialNumber"
                  dir="auto"
                  class="mb-2"
                  outlined
                  flat
                  maxlength="16"
                  :rules="[
                    v => !!v || 'کد دستگاه را وارد کنید',
                  ]"
                  type="number"
                  label="کد دستگاه"
                  hint="کد دستگاه روی کارت گارانتی داخل جعبه محصول درج شده است."
                  persistent-hint
                  prepend-inner-icon="mdi-barcode"
                  rounded
                  hide-details="auto"
                  tabindex="1"
                />
                <!-- <v-btn v-if="platform !== 'web'" rounded color="info darken-2" class="mx-auto mb-6 d-block" @click="askUser">
                  اسکن بارکد با دوربین
                </v-btn> -->
                <transition name="slide-y-reverse-transition">
                  <v-btn
                    v-if="valid.checkDeviceForm"
                    dark
                    block
                    large
                    rounded
                    color="green darken-3"
                    :loading="loading"
                    type="submit"
                    tabindex="2"
                  >
                    <span class="font-weight-bold text-body-1">مرحله بعد</span>
                  </v-btn>
                </transition>
              </v-form>
            </v-stepper-content>
            <v-stepper-content step="2" class="px-0">
              <v-form ref="deviceDetailForm" v-model="valid.deviceDetailForm" class="pt-4" @submit.prevent="submitDeviceDetail">
                <v-text-field
                  v-model="formData.simCardNumber"
                  dir="auto"
                  class="mb-4"
                  outlined
                  flat
                  type="tel"
                  validate-on-blur
                  label="شماره سیم کارت داخل دستگاه"
                  required
                  maxlength="11"
                  :rules="[
                    v => !!v || 'شماره سیم کارت را وارد کنید',
                    v => /^09\d{9}$/.test(v) || 'شماره موبایل صحیح نمی‌باشد.'
                  ]"
                  prepend-inner-icon="mdi-sim-outline"
                  rounded
                  hide-details="auto"
                  tabindex="1"
                />
                <v-text-field
                  v-model="formData.nickname"
                  dir="auto"
                  class="mb-4"
                  outlined
                  flat
                  type="text"
                  label="نام مستعار دستگاه"
                  hint="یک نام دلخواه برای دستگاه تعیین کنید. مثال: دزدگیر خانه"
                  persistent-hint
                  prepend-inner-icon="mdi-ballot-outline"
                  rounded
                  hide-details="auto"
                  tabindex="2"
                />
                <v-text-field
                  v-model="formData.location"
                  dir="auto"
                  class="mb-4"
                  outlined
                  flat
                  type="text"
                  label="محل نصب دستگاه"
                  hint="در محل نصب هر اسمی که می‌خواهید وارد کنید. به عنوان مثال: خانه، کارگاه، مغازه و ..."
                  persistent-hint
                  prepend-inner-icon="mdi-home-outline"
                  rounded
                  hide-details="auto"
                  tabindex="3"
                />
                <v-btn
                  dark
                  block
                  large
                  rounded
                  color="green darken-3"
                  :disabled="!valid.deviceDetailForm"
                  :loading="loading"
                  type="submit"
                  tabindex="3"
                >
                  <span class="font-weight-bold text-body-1">مرحله بعد</span>
                </v-btn>
              </v-form>
            </v-stepper-content>
            <template v-if="numberOfSteps > 3">
              <v-stepper-content step="3" class="px-0">
                <p class="text-body-1">
                  در این مرحله شماره‌ی زیر به عنوان مدیر اصلی در حافظه دستگاه ثبت خواهد شد.
                </p>
                <span class="d-block faNum font-weight-bold primary--text my-4 text-center" style="font-size:2rem;">
                  {{ firstAdminNumber }}
                </span>
                <div v-if="isDualSim">
                  <div v-if="typeof user.simCardSlot === 'undefined'" class="text-body-1">
                    با توجه به اینکه از این پس کلیه ارتباطات با دستگاه از طریق این شماره خواهد بود، لطفا انتخاب کنید این شماره مربوط به کدام سیم کارت است:
                    <v-form ref="dualSimForm" v-model="valid.dualSimForm" class="pt-4" @submit.prevent="submitSMSConfirmStep">
                      <v-radio-group v-model="selectedSim" class="px-4" :rules="[rules.required]">
                        <v-radio
                          v-for="(sim,i) in simInfo.activeSubscriptionInfoCount"
                          :key="i"
                          class="mb-4"
                          :label="`سیم کارت ${i+1} ${sim.displayName ? '('+sim.displayName+')' : ''}`"
                          :value="i + 1"
                        />
                      </v-radio-group>
                      <v-btn
                        block
                        dark
                        large
                        rounded
                        color="green darken-3"
                        :disabled="!valid.dualSimForm"
                        :loading="loading"
                        type="submit"
                      >
                        <span class="font-weight-bold text-body-1">مرحله بعد</span>
                      </v-btn>
                    </v-form>
                  </div>
                  <div v-else>
                    <p class="text-body-1">
                      پیامک تایید از طریق سیمکارت <span class="faNum">{{ user.simCardSlot + 1 }}</span> ارسال می شود.
                    </p>
                    <v-btn
                      block
                      large
                      rounded
                      color="green darken-3"
                      :loading="loading"
                      @click="submitSMSConfirmStep(false)"
                    >
                      <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
                    </v-btn>
                  </div>
                </div>
                <div v-else>
                  <v-btn
                    block
                    large
                    rounded
                    color="green darken-3"
                    :loading="loading"
                    @click="submitSMSConfirmStep(false)"
                  >
                    <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
                  </v-btn>
                </div>
              </v-stepper-content>
              <v-stepper-content step="4" class="px-0">
                <p v-if="!showManualConfirm" class="text-body-1">
                  یک پیامک جهت ثبت شماره شما به دستگاه ارسال شده است. لطفا تا زمان دریافت پیامک تایید صبر کنید.
                </p>
                <div v-else>
                  <p class="text-body-1">
                    چنانچه پیامک تایید را از دستگاه دریافت کرده‌اید، دکمه زیر را بزنید.
                  </p>
                  <v-btn
                    block
                    large
                    rounded
                    color="green darken-3"
                    :loading="loading"
                    @click="step = 5"
                  >
                    <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
                  </v-btn>
                </div>
                <div class="spinner">
                  <div class="rect1" />
                  <div class="rect2" />
                  <div class="rect3" />
                  <div class="rect4" />
                  <div class="rect5" />
                </div>
              </v-stepper-content>
            </template>
            <v-stepper-content :step="numberOfSteps === 3 ? 3 : 5" class="px-0">
              <p v-if="platform === 'web'" class="text-body-1 mb-4">
                دستگاه به حساب کاربری شما افزوده شد. جهت ثبت شماره خود به عنوان مدیر اول به پنل دستگاه مراجعه کنید.
              </p>
              <p v-else class="text-body-1 mb-4">
                شماره شما با موفقیت به عنوان مدیر اصلی در حافظه دستگاه ثبت شد.
              </p>
              <v-btn color="secondary" block x-large rounded @click="syncDeviceWithServer">
                پایان فرآیند
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
import { Sim } from '@ionic-native/sim'
import { SMS } from '@awesome-cordova-plugins/sms'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
export default {
  layout: 'dashboard',
  data () {
    return {
      bodyStyle: '',
      loading: false,
      valid: {
        checkDeviceForm: false,
        deviceDetailForm: false,
        dualSimForm: false
      },
      selectedSim: null,
      step: 1,
      simInfo: {},
      rules: {
        required: v => !!v || 'لطفاً یک مورد را انتخاب کنید'
      },
      isDualSim: false,
      verifyDeviceDialog: false,
      formData: {
        deviceType: 0,
        nickname: '',
        serialNumber: '',
        simCardNumber: '',
        location: ''
      },
      showManualConfirm: false
    }
  },
  computed: {
    stepTitle () {
      return this.step === 1
        ? 'نوع دستگاه و کد دستگاه'
        : this.step === 2
          ? 'شماره سیم‌کارت و محل نصب دستگاه'
          : this.step === 3
            ? 'تایید شماره سیم کارت'
            : this.step === 4
              ? 'تایید پیامک'
              : this.step === 5
                ? 'پایان فرآیند'
                : ''
    },
    numberOfSteps () {
      if (this.platform === 'android') {
        return 5
      } else {
        return 3
      }
    },
    platform () {
      return this.$store.state.platform
    },
    firstAdminNumber () {
      return this.$auth.user.phone
    },
    setAdminCommand () {
      const command = this.$store.getters['commands/getCommand']({ name: 'setAdmin', adminIndex: 1, adminPhone: this.firstAdminNumber })
      return command
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
  created () {
    this.$nuxt.$on('deviceChecked', (resp) => {
      this.loading = false
      if (resp.status === 200) {
        this.step = 2
        this.$toast.success(resp.data.message)
      } else if (resp.status === 201) {
        this.$toast.success(resp.data.message)
      }
    })
    this.$nuxt.$on('deviceAdded', (device) => {
      this.loading = false
      this.saveDeviceToLocal(device)
      this.$toast.success('دستگاه با موفقیت اضافه شد!')
      this.$router.push('/dashboard/')
    })
    this.$nuxt.$on('error', (resp) => {
      this.loading = false
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('error')
    this.$nuxt.$off('deviceChecked')
    this.$nuxt.$off('deviceAdded')
  },
  methods: {
    async didUserGrantPermission () {
      // check if user already granted permission
      const status = await BarcodeScanner.checkPermission({ force: false })
      if (status.granted) {
        // user granted permission
        return true
      }
      if (status.denied) {
        // user denied permission
        return false
      }
      if (status.asked) {
        // system requested the user for permission during this call
        // only possible when force set to true
      }
      if (status.neverAsked) {
        // user has not been requested this permission before
        // it is advised to show the user some sort of prompt
        // this way you will not waste your only chance to ask for the permission
        const c = confirm(
          'برای اسکن بارکد لازم است که اجازه دسترسی به دوربین را به برنامه بدهید'
        )
        if (!c) {
          return false
        }
      }
      if (status.restricted || status.unknown) {
        // ios only
        // probably means the permission has been denied
        return false
      }
      // user has not denied permission
      // but the user also has not yet granted the permission
      // so request it
      const statusRequest = await BarcodeScanner.checkPermission({ force: true })
      if (statusRequest.asked) {
        // system requested the user for permission during this call
        // only possible when force set to true
      }
      if (statusRequest.granted) {
        // the user did grant the permission now
        return true
      }
      // user did not grant the permission, so he must have declined the request
      return false
    },
    async checkPermission () {
      const status = await BarcodeScanner.checkPermission()
      if (status.denied) {
        // the user denied permission for good
        // redirect user to app settings if they want to grant it anyway
        const c = confirm(
          'برای اسکن بارکد از طریق تنظیمات تلفن به برنامه اجازه دسترسی به دوربین را بدهید.'
        )
        if (c) {
          BarcodeScanner.openAppSettings()
        }
      }
    },
    prepare  () {
      BarcodeScanner.prepare()
    },
    hideBackground () {
      document.getElementById('main-container').style.visibility = 'hidden'
      document.querySelector('main').classList.remove('accent')
      document.querySelector('main').classList.add('transparent')
      document.querySelector('#app').setAttribute('style', 'background-color: transparent !important;')
      document.querySelector('body').setAttribute('style', 'background-color: transparent !important;')
    },
    showBackground () {
      document.getElementById('main-container').style.visibility = 'visible'
      document.querySelector('main').classList.add('accent')
      document.querySelector('main').classList.remove('transparent')
      document.querySelector('#app').removeAttribute('style')
      document.querySelector('body').removeAttribute('style')
    },
    async startScan  () {
      this.$store.commit('setIsScanningBarcode', true)
      this.hideBackground()
      const result = await BarcodeScanner.startScan()
      if (result.hasContent) {
        this.stopScan()
        this.formData.serialNumber = result.content
      }
    },
    stopScan  () {
      this.$store.commit('setIsScanningBarcode', false)
      this.showBackground()
      BarcodeScanner.stopScan()
    },
    async askUser () {
      this.prepare()
      const c = await this.didUserGrantPermission()
      if (c) {
        this.startScan()
      } else {
        this.stopScan()
      }
    },
    getSimInfo () {
      const self = this
      Sim.getSimInfo().then(
        (info) => { self.simInfo = info },
        err => self.$toast.error(err)
      )
    },
    checkDevice () {
      this.loading = true
      if (!this.$refs.checkDeviceForm.validate()) {
        return false
      }
      this.$store.commit('commands/setCurrentPassword', '0000')
      this.$nuxt.$emit('postReq', 'user/check-device', 'deviceChecked', this.formData)
    },
    async submitDeviceDetail () {
      if (this.platform !== 'web') {
        const res = await Sim.hasReadPermission()
        if (!res) {
          AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.READ_PHONE_STATE).then((res) => {
            AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.READ_PHONE_STATE).then((res) => {
              if (!res.hasPermission) {
                this.$toast.error('برای ادامه نیاز به دسترسی به سیم کارت داریم.'); return false
              }
            })
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err)
            this.$toast.error('برای ادامه نیاز به دسترسی به سیم کارت داریم.'); return false
          })
        }
        const simInfo = await Sim.getSimInfo()
        this.simInfo = simInfo
        if (this.simInfo.phoneCount > 1 && this.simInfo.activeSubscriptionInfoCount > 1) {
          this.isDualSim = true
        } else {
          this.isDualSim = false
        }
      }
      this.step = 3
    },
    submitSMSConfirmStep (validate = true) {
      if (this.isDualSim && validate) {
        if (!this.$refs.dualSimForm.validate()) { return false }
        this.$emit('setSimCardSlot', this.selectedSlot)
      }
      this.checkAndSend(this.formData.simCardNumber, this.setAdminCommand)
      this.step = 4
      this.startWatching()
    },
    startWatching () {
      setTimeout(() => {
        this.showManualConfirm = true
      }, 30 * 1000)
      SmsRetriever.startWatching().then((res) => {
        this.manualSMSConfirm()
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
    },
    manualSMSConfirm () {
      this.step = 5
    },
    sendSMS (number, message) {
      const self = this
      SMS.send(number, message, { android: { intent: '', slot: this.selectedSlot } })
        .then(() => {
          self.$toast.success('پیامک با موفقیت ارسال شد.')
        })
        .catch((err) => {
          self.$toast.error('مشکلی در ارسال پیامک به وجود آمده است.' + err)
          self.step = 3
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
    },

    saveDeviceToLocal (device) {
      this.$nuxt.$emit('saveDeviceToLocal', device)
    },
    setSimCardSlot (slot) {
      this.$nuxt.$emit('updateUser', 'simCardSlot', slot)
    },
    syncDeviceWithServer () {
      this.loading = true
      this.formData.devicePassword = this.$store.getters['commands/getCurrentPassword'] || '0000'
      this.$nuxt.$emit('postReq', 'user/add-new-device', 'deviceAdded', this.formData)
    }
  }
}
</script>
<style>

</style>
