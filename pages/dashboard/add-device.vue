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
              <v-form ref="checkDeviceForm" v-model="valid.checkDeviceForm" @submit.prevent="checkDevice">
                <v-select
                  v-model="formData.deviceType"
                  :items="deviceTypes"
                  filled
                  rounded
                  label="نوع دستگاه"
                  dense
                  tabindex="1"
                />
                <v-text-field
                  v-model="formData.serialNumber"
                  dir="auto"
                  class="mb-4"
                  filled
                  flat
                  maxlength="16"
                  :rules="[
                    v => !!v || 'شماره سریال را وارد کنید',
                  ]"
                  type="number"
                  label="شماره سریال محصول"
                  hint="شماره سریال روی کارت گارانتی داخل جعبه محصول درج شده است."
                  persistent-hint
                  prepend-inner-icon="mdi-barcode"
                  rounded
                  hide-details="auto"
                  tabindex="2"
                />
                <v-btn
                  block
                  large
                  rounded
                  color="green darken-3"
                  :disabled="!valid.checkDeviceForm"
                  :loading="loading"
                  type="submit"
                  tabindex="3"
                >
                  <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
                </v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-content step="2" class="px-0">
              <v-form ref="deviceDetailForm" v-model="valid.deviceDetailForm" @submit.prevent="submitDeviceDetail">
                <v-text-field
                  v-model="formData.simCardNumber"
                  dir="auto"
                  class="mb-4"
                  filled
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
                  filled
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
                  filled
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
                  block
                  large
                  rounded
                  color="green darken-3"
                  :disabled="!valid.deviceDetailForm"
                  :loading="loading"
                  type="submit"
                  tabindex="3"
                >
                  <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
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
                    <v-form ref="dualSimForm" v-model="valid.dualSimForm" @submit.prevent="submitSMSConfirmStep">
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
                        large
                        rounded
                        color="green darken-3"
                        :disabled="!valid.dualSimForm"
                        :loading="loading"
                        type="submit"
                      >
                        <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
                      </v-btn>
                    </v-form>
                  </div>
                  <div v-else>
                    <p class="text-body-1">
                      پیامک تایید از طریق سیمکارت <span class="faNum">{{ user.simCardSlot }}</span> ارسال می شود.
                    </p>
                    <v-btn
                      block
                      large
                      rounded
                      color="green darken-3"
                      :loading="loading"
                      @click="submitSMSConfirmStep"
                    >
                      <span class="font-weight-bold white--text text-body-1">مرحله بعد</span>
                    </v-btn>
                  </div>
                </div>
              </v-stepper-content>
              <v-stepper-content step="4" class="px-0">
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
import { Sim } from '@ionic-native/sim'
import { SMS } from '@awesome-cordova-plugins/sms'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
export default {
  layout: 'dashboard',
  data () {
    return {
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
      deviceTypes: [
        { text: 'پایش امنیت هوشمند', value: 0 },
        { text: 'تشخیص دود هوشمند', value: 1 },
        { text: 'دزدگیر هوشمند', value: 2 }
      ]
    }
  },
  computed: {
    stepTitle () {
      return this.step === 1
        ? 'نوع دستگاه و شماره سریال'
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
  created () {
    this.$nuxt.$on('error', () => {
      this.loading = false
    })
    this.$nuxt.$on('deviceChecked', (resp) => {
      this.loading = false
      if (resp.status === 200) {
        this.step = 2
        this.$toast.success(resp.data.message)
      } else if (resp.status === 201) {
        this.$toast.success(resp.data.message)
      }
    })
    this.$nuxt.$on('deviceAdded', () => {
      this.loading = false
      this.$toast.success('دستگاه با موفقیت اضافه شد!')
      this.$router.push('/dashboard/')
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('error')
    this.$nuxt.$off('deviceChecked')
    this.$nuxt.$off('deviceAdded')
  },
  methods: {
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
          const permission = await AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.READ_PHONE_STATE)
          if (!permission.hasPermission) {
            this.$toast.error('برای ادامه نیاز به دسترسی به سیم کارت داریم.'); return false
          }
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
    submitSMSConfirmStep () {
      if (this.isDualSim) {
        if (!this.$refs.dualSimForm.validate()) { return false }
        this.$emit('setSimCardSlot', this.selectedSlot)
      }
      this.checkAndSend(this.formData.simCardNumber, this.setAdminCommand)
      this.step = 4
      this.startWatching()
    },
    startWatching () {
      SmsRetriever.startWatching().then((res) => {
        this.saveDeviceToLocal()
        this.step = 5
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

    saveDeviceToLocal () {
      this.$nuxt.$emit('saveDeviceToLocal')
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
