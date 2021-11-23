<template>
  <v-container class="pt-0 px-6 h-2/3">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <div class="text-center">
          <h4 class="text--primary mb-2">
            به هودا خوش آمدید
          </h4>
          <p class="text--secondary text-body-2">
            {{ subtitle }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <v-form ref="registerMobile" v-model="valid">
          <v-text-field
            dir="auto"
            filled
            flat
            single-line
            type="number"
            label="شماره موبایل"
            :class="{'validInput': valid}"
            prepend-inner-icon="mdi-phone"
            :rules="[rules.required, rules.numeric, rules.startsWith09, rules.mobileLength]"
            rounded
            hide-details="auto"
            @focus="scrollIntoView"
          />
        </v-form>
      </v-col>
      <v-col cols="12" sm="4" offset-sm="4">
        <v-btn
          block
          large
          rounded
          class="text-h6"
          color="primary"
          :loading="loading"
          @click="submit"
        >
          ادامه
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-stepper v-model="step" flat tile elevation="0" class="accent">
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
        <v-stepper-content step="1">
          <v-row align="center" class="fixed">
            <v-col cols="12" sm="6" offset-sm="3">
              <v-text-field
                dir="auto"
                filled
                flat
                single-line
                type="number"
                label="شماره موبایل"
                prepend-inner-icon="mdi-phone"
                rounded
                hide-details="auto"
                @focus="scrollIntoView"
              />
            </v-col>
            <v-col cols="12" sm="4" offset-sm="4">
              <v-btn
                block
                rounded
                color="primary"
                :loading="loading"
                @click="submit"
              >
                ادامه
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-img
            src="/svg/otp.svg"
            max-height="256px"
            contain
            class="mb-4 rounded-xl"
          />
          <v-row align="center">
            <v-col cols="12" sm="6" offset-sm="3">
              <v-form ref="otpForm" class="verify-form" @submit="submit">
                <OtpInput
                  ref="otpInput"
                  v-model="vcode"
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
              </v-form>
            </v-col>
            <v-col cols="12" sm="4" offset-sm="4">
              <v-btn
                block
                rounded
                color="primary"
                :loading="loading"
                @click="submit"
              >
                ادامه
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-row align="center">
            <v-col cols="12" sm="6" offset-sm="3">
              <v-text-field
                dir="auto"
                class="mb-4"
                filled
                flat
                single-line
                label="نام و نام خانوادگی"
                prepend-inner-icon="mdi-account-outline"
                rounded
                hide-details="auto"
              />
              <v-text-field
                dir="auto"
                class="mb-4"
                filled
                flat
                single-line
                label="شهر"
                prepend-inner-icon="mdi-map-marker"
                rounded
                hide-details="auto"
              />
              <v-text-field
                dir="auto"
                class="mb-4"
                filled
                flat
                single-line
                label="ایمیل اختیاری"
                prepend-inner-icon="mdi-email-outline"
                rounded
                hide-details="auto"
              />
              <v-text-field
                dir="auto"
                class="mb-4"
                filled
                type="password"
                flat
                single-line
                label="گذرواژه"
                prepend-inner-icon="mdi-lock"
                rounded
                hide-details="auto"
              />
              <v-text-field
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
            </v-col>
            <v-col cols="12" sm="4" offset-sm="4">
              <v-btn
                block
                rounded
                color="primary"
                :loading="loading"
                @click="submit"
              >
                ادامه
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper> -->
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
      valid: false,
      step: 1,
      vcode: '',
      rules: {
        required: v => !!v || 'برای ادامه به شماره موبایل شما نیاز داریم.',
        startsWith09: v => /^09/.test(v) || 'شماره موبایل باید با 09 شروع شود.',
        mobileLength: v => (!!v && v.length === 11) || 'شماره موبایل باید 11 رقم باشد',
        numeric: v => /^\d+$/.test(v) || 'شماره موبایل باید تنها شامل عدد باشد'
      }
    }
  },
  computed: {
    subtitle () {
      switch (this.step) {
        case 1:
          return 'برای ثبت‌نام لطفاً شماره موبایل خود را وارد کنید:'
        case 2:
          return 'لطفاً کد تایید ۴ رقمی را وارد کنید'
        case 3:
          return 'لطفاً اطلاعات کاربری خود را ثبت کنید'
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
  methods: {
    submit () {
      const self = this
      self.loading = true
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          self.loading = false
          if (self.step < 3) {
            self.step++
          } else {
            this.$router.push('/auth/login')
          }

          resolve('foo')
        }, 1000)
      })
    },
    scrollIntoView (e) {
      e.target.scrollIntoView({ behavior: 'smooth' })
    },
    handleOnComplete (value) {
      this.vcode = value
      this.submit()
    },
    handleOnChange (value) {
      this.vcode = value
    },
    clearInput () {
      this.$refs.otpInput.clearInput()
    }
  }
}
</script>

<style>
.v-stepper__header {
  height: 32px !important;
}
.hide-divider hr {
  display: none;
}
.v-stepper__step__step {
  height: 10px !important;
  min-width: 10px !important;
  width: 10px !important;
}
.v-stepper__step {
  padding: 10px !important;
}
.verify-form {
  direction: ltr;
}
.verify-form input.otp-input {
  background-color: rgb(156 156 157 / 12%);
  border: 1px solid rgb(255 255 255 / 40%);
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  color: rgb(156 156 157);
  text-align: center;
  font-size: 2.5rem;
  outline: none !important;
  transition: all 0.3s ease-in-out;
}
.verify-form input.otp-input:focus,
input.otp-input:focus-visible {
  border: 2px solid rgb(156 156 157 / 80%);
  background-color: rgb(156 156 157 / 45%);
}
</style>
