<template>
  <v-container class="pt-0 px-6 h-2/3">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" class="pb-0">
        <div class="text-center">
          <h4 class="text--primary mb-2">
            ورود به اپلیکیشن هودا
          </h4>
          <p class="text--secondary text-body-2 mb-8">
            جهت ورود لطفاً شماره موبایل و گذرواژه خود را وارد کنید
          </p>
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="pt-0">
        <v-form ref="userLoginForm" v-model="valid" autocomplete="off" @submit.prevent="submitLogin">
          <v-text-field
            v-model="login.phone"
            class="mb-4"
            dir="auto"
            filled
            flat
            single-line
            type="tel"
            label="شماره موبایل"
            validate-on-blur
            prepend-inner-icon="mdi-phone"
            rounded
            maxlength="11"
            minlength="11"
            :rules="[(v) => !!v || 'برای ورود به شماره همراه شما نیاز داریم',rules.phone]"
            hide-details="auto"
            autofocus
            tabindex="1"
          />
          <v-text-field
            v-model="login.password"
            autocomplete="off"
            class="mb-4"
            dir="auto"
            filled
            type="password"
            flat
            single-line
            label="گذرواژه"
            prepend-inner-icon="mdi-lock"
            rounded
            :rules="[(v) => !!v || 'برای ورود گذرواژه خود را وارد کنید']"
            hide-details="auto"
            tabindex="2"
          />
          <div class="text-center">
            <nuxt-link class="text-decoration-none text-body-2 mb-4" to="/auth/forgot-password">
              فراموشی گذرواژه
            </nuxt-link>
          </div>
          <v-switch
            v-model="login.remember"
            class="mb-4"
            inset
            label="ذخیره اطلاعات ورود"
            hide-details="auto"
          />
          <v-btn
            block
            large
            rounded
            color="primary"
            :disabled="!valid"
            :loading="loading"
            type="submit"
            tabindex="3"
          >
            ورود
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  auth: 'guest',
  data () {
    return {
      valid: false,
      loading: false,
      login: {
        phone: '',
        password: '',
        remember: false
      },
      rules: {
        phone: v => /^09[0-9]{9}$/.test(v) || 'شماره موبایل صحیح نیست'
      }
    }
  },
  created () {
    this.$nuxt.$on('error', () => {
      this.loading = false
      this.login.password = ''
      this.$refs.userLoginForm.resetValidation()
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('error')
  },
  methods: {
    submitLogin () {
      if (this.valid) {
        this.loading = true
        this.$nuxt.$emit('login', this.login)
      }
    }
  }
}
</script>
<style>

</style>
