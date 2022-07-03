<template>
  <v-container class="pt-0 px-6 h-2/3">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" class="pb-0">
        <div class="text-center">
          <h4 class="text--primary mb-2">
            فراموشی رمز عبور
          </h4>
          <p class="text--secondary text-body-2 mb-2">
            {{ subtitle }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="pt-0">
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
              <v-form ref="phoneNumberForm" v-model="valid.phoneNumber" @submit.prevent="submitPhoneNumber">
                <v-text-field
                  v-model="phoneNumber"
                  dir="auto"
                  filled
                  flat
                  single-line
                  type="tel"
                  maxlength="11"
                  minlength="11"
                  label="شماره موبایل"
                  :class="{'validInput': valid.phoneNumber}"
                  prepend-inner-icon="mdi-phone"
                  :rules="[rules.required, rules.validMobile]"
                  rounded
                  @focus="scrollIntoView"
                />
                <v-btn
                  block
                  large
                  rounded
                  class="text-h6 mt-4"
                  color="primary"
                  :loading="loading"
                  :disabled="!valid.phoneNumber"
                  type="submit"
                >
                  ادامه
                </v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-content step="2" class="px-0 pt-0">
              <v-form ref="otpForm" v-model="valid.otp" class="otp-form" @submit.prevent="submitOTP">
                <p class="text-center text-body-2 rtl mt-2">
                  یک کد ۴ رقمی به شماره <span class="ltr d-inline-block font-weight-bold primary--text">{{ maskedPhoneNumber }}</span> ارسال شده است.<br>
                  <span
                    class="primary--text"
                    @click="editPhoneNumber"
                  >
                    ویرایش شماره
                  </span>
                </p>
                <OtpInput
                  ref="otpInput"
                  v-model="otp"
                  style="justify-content: space-between"
                  input-classes="otp-input"
                  separator=""
                  :num-inputs="4"
                  :should-auto-focus="true"
                  :is-input-num="true"
                  :class="{ disabled: loading }"
                  @on-change="handleOnChange"
                  @on-complete="handleOnComplete"
                />
                <p v-if="remainingTime > 0" class="mt-4 mb-8 text-center text-body-2 rtl">
                  درخواست کد جدید بعد از  {{ remainingTime }} ثانیه
                </p>
                <v-btn
                  v-else
                  text
                  tile
                  elevation="0"
                  color="primary"
                  class="d-block mx-auto mt-4"
                  @click="submitPhoneNumber"
                >
                  ارسال مجدد کد
                </v-btn>
                <v-btn
                  block
                  large
                  rounded
                  class="text-h6 mt-4"
                  color="primary"
                  :loading="loading"
                  :disabled="!valid.otp"
                  type="submit"
                >
                  ثبت کد
                </v-btn>
              </v-form>
            </v-stepper-content>
            <v-stepper-content step="3" class="px-0 pt-0">
              <v-form ref="userInfoForm" v-model="valid.userInfo" @submit.prevent="submitUserInfo">
                <v-text-field
                  v-model="password"
                  dir="auto"
                  class="mb-4"
                  filled
                  type="password"
                  flat
                  single-line
                  label="گذرواژه"
                  hint="حداقل ۸ کاراکتر"
                  prepend-inner-icon="mdi-lock"
                  rounded
                  hide-details="auto"
                />
                <v-text-field
                  v-model="passwordConfirm"
                  dir="auto"
                  class="mb-4"
                  filled
                  type="password"
                  flat
                  single-line
                  label="تکرار گذرواژه"
                  prepend-inner-icon="mdi-lock"
                  rounded
                  hide-details="auto"
                />
                <v-btn
                  block
                  large
                  rounded
                  class="text-h6 mt-4"
                  color="primary"
                  :loading="loading"
                  :disabled="!valid.userInfo"
                  type="submit"
                >
                  ثبت اطلاعات
                </v-btn>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OtpInput from '@bachdgvn/vue-otp-input'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { OtpInput },
  layout: 'auth',
  middleware: 'auth',
  auth: 'guest',
  data () {
    return {
      loading: false,
      valid: {
        phoneNumber: false,
        otp: false,
        userInfo: false
      },
      password: '',
      passwordConfirm: '',
      messages: [],
      phoneNumber: '',
      maskedPhoneNumber: '',
      loginHash: '',
      signUpHash: '',
      otp: '',
      waitTime: 180,
      startTime: 0,
      remainingTime: 0,
      timerID: null,
      rules: {
        required: v => !!v || 'برای ادامه به شماره موبایل شما نیاز داریم.',
        validMobile: v => /^09\d{9}$/.test(v) || 'شماره موبایل صحیح نمی‌باشد.'
      },
      step: 1
    }
  },
  computed: {
    subtitle () {
      switch (this.step) {
        case 1:
          return 'برای بازیابی رمز عبور لطفاً شماره موبایل خود را وارد کنید:'
        case 2:
          return 'تایید شماره همراه'
        case 3:
          return 'لطفاً رمز جدید خود را وارد کنید'
        default:
          return ''
      }
    }
  },
  watch: {
    step (newVal) {
      if (newVal === 2) {
        setTimeout(() => {
          document.getElementsByClassName('otp-input')[0].focus()
        }, 100)
      }
    }
  },
  created () {
    this.$nuxt.$on('error', () => {
      this.loading = false
      this.$refs.otpForm.resetValidation()
      this.$refs.otpInput.clearInput()
    })
    this.$nuxt.$on('otpSent', (resp) => {
      this.loading = false
      this.loginHash = resp.data.loginHash
      this.maskedPhoneNumber = resp.data.phoneNumber
      this.startTime = Date.now()
      this.remainingTime = 0
      this.timerID = setInterval(() => {
        this.countDown()
      }, 1000)
      this.countDown()
      this.step = 2
    })
    this.$nuxt.$on('otpVerified', (resp) => {
      this.signUpHash = resp.data.hash
      this.loading = false
      this.step = 3
    })
    this.$nuxt.$on('passwordHasBeenReset', async (resp) => {
      this.loading = false
      await this.$auth.setUserToken(resp.data.access_token)
      this.$nuxt.$emit('userLoggedIn', resp.data.user)
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('error')
    this.$nuxt.$off('otpSent')
    this.$nuxt.$off('otpVerified')
    this.$nuxt.$off('passwordHasBeenReset')
  },
  methods: {
    editPhoneNumber () {
      this.step = 1
      this.phoneNumber = ''
      this.clearInput()
      this.resetValidation('phoneNumberForm')
      clearInterval(this.timerID)
      this.timerID = null
    },
    countDown () {
      if (this.remainingTime >= 0) {
        this.remainingTime = this.waitTime - Math.floor((Date.now() - this.startTime) / 1000)
      } else {
        clearInterval(this.timerID)
        this.timerID = null
      }
    },
    submitPhoneNumber () {
      if (!this.$refs.phoneNumberForm.validate()) {
        return false
      }
      this.loading = true
      this.$nuxt.$emit('postReq', 'auth/forgot-password', 'otpSent', { phone: this.phoneNumber })
    },
    submitOTP () {
      if (!this.$refs.otpForm.validate()) {
        return false
      }
      this.loading = true
      this.$nuxt.$emit('postReq', 'auth/forgot-password/verify-otp', 'otpVerified', { phone: this.phoneNumber, loginHash: this.loginHash, otp: this.otp })
    },
    submitUserInfo () {
      if (!this.$refs.userInfoForm.validate()) {
        return false
      }
      this.loading = true
      this.$nuxt.$emit('postReq', 'auth/reset-user-password', 'passwordHasBeenReset',
        {
          password: this.password,
          password_confirmation: this.passwordConfirm,
          hash: this.signUpHash,
          phone: this.phoneNumber
        })
    },
    scrollIntoView (e) {
      e.target.scrollIntoView({ behavior: 'smooth' })
    },
    handleOnComplete (value) {
      this.otp = value
      this.submitOTP()
    },
    handleOnChange (value) {
      this.otp = value
    },
    resetValidation (form) {
      this.$refs[form].resetValidation()
    },
    clearInput () {
      this.$refs.otpInput.clearInput()
    }
  }
}
</script>

<style>

</style>
