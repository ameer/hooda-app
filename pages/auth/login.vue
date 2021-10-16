<template>
  <v-container class="px-8">
    <div class="text-center">
      <h4 class="text--primary mb-2">
        ورود به اپلیکیشن هودا
      </h4>
    </div>
    <v-row align="center">
      <v-col cols="12" sm="6" offset-sm="3">
        <p class="mt-8 text-center text--secondary text-body-1">
          جهت ورود لطفاْ شماره موبایل و گذرواژه خود را وارد کنید
        </p>
      </v-col>
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
          autofocus
        />
      </v-col>
      <v-col cols="12" sm="6" offset-sm="3">
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
      </v-col>
      <v-col cols="12" sm="6" offset-sm="3">
        <nuxt-link class="text-decoration-none" to="/auth/forgot-password">
          بازیابی رمز عبور
        </nuxt-link>
      </v-col>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-checkbox label="ذخیره اطلاعات ورود" />
      </v-col>
      <v-col cols="12" sm="4" offset-sm="4">
        <v-btn
          block
          large
          rounded
          color="primary"
          :loading="loading"
          @click="submit"
        >
          ورود
        </v-btn>
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
      loading: false
    }
  },
  methods: {
    submit () {
      const self = this
      self.loading = true
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          self.loading = false
          this.$router.push('/dashboard/')
          resolve('foo')
        }, 1000)
      })
    }
  }
}
</script>
<style>

</style>
