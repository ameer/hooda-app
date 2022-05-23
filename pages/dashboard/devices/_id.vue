<template>
  <section id="single-device-page">
    <v-container v-if="device !== null" class="h-100 pa-0">
      <div class="text-h5 font-weight-bold text--secondary mt-4 mb-4 text-center">
        ویرایش دستگاه
      </div>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" lg="4" xl="3">
          <v-card rounded="xl" class="device-card">
            <v-card-text>
              <v-form ref="deviceDetailForm" v-model="valid.deviceDetailForm" @submit.prevent="updateDevice">
                <v-text-field
                  v-model="formData.simCardNumber"
                  dir="auto"
                  class="mb-4"
                  filled
                  flat
                  type="tel"
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
                  <span class="font-weight-bold text-body-1">ذخیره اطلاعات</span>
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else class="h-100 pa-0">
      <div class="text-h5 font-weight-bold text--secondary mt-4 mb-4 text-center">
        دستگاه موردنظر پیدا نشد
      </div>
    </v-container>
  </section>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      device: null,
      loading: false,
      valid: {
        deviceDetailForm: true
      },
      formData: {
        deviceType: 0,
        nickname: '',
        serialNumber: '',
        simCardNumber: '',
        location: ''
      }
    }
  },
  mounted () {
    this.$nuxt.$emit('getDeviceById', this.$route.params.id, 'deviceRecieved')
    this.loading = true
    if ((this.device === null || this.device === undefined) && this.$store.state.onlineStatus) {
      this.$nuxt.$emit('postReq', `user/device/${this.$route.params.id}`, 'deviceRecieved')
    }
  },
  created () {
    this.$nuxt.$on('error', () => {
      this.loading = false
    })
    this.$nuxt.$on('deviceRecieved', (resp) => {
      this.loading = false
      if (resp.data !== undefined) {
        this.device = resp.data
        this.formData.simCardNumber = this.device.sim_number
        this.formData.nickname = this.device.nickname
        this.formData.location = this.device.location
      }
    })
    this.$nuxt.$on('deviceUpdated', (resp) => {
      this.loading = false
      this.$toast.success('دستگاه با موفقیت بروزرسانی شد!')
      this.$nuxt.$emit('saveDeviceToLocal', resp.data.device)
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('deviceRecieved')
    this.$nuxt.$off('error')
    this.$nuxt.$off('deviceUpdated')
  },
  methods: {
    updateDevice () {
      this.loading = true
      this.$nuxt.$emit('putReq', `user/update-device/${this.$route.params.id}`, 'deviceUpdated', this.formData)
    }
  }
}
</script>
<style>

</style>
