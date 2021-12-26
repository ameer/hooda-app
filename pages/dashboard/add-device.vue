<template>
  <v-container>
    <h4 class="text--primary mb-4 text-center">
      نوع دستگاه خود را انتخاب کنید:
    </h4>
    <v-row align="center" justify="center" class="mt-4">
      <v-col cols="12" md="4">
        <v-select
          v-model="formData.deviceType"
          :items="deviceTypes"
          filled
          rounded
          label="نوع دستگاه"
          dense
        />
        <v-form ref="addNewDeviceForm" v-model="valid" @submit.prevent="submitNewDevice">
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
          />
          <v-btn
            block
            large
            rounded
            color="green darken-2"
            :disabled="!valid"
            :loading="loading"
            type="submit"
            tabindex="3"
          >
            افزودن دستگاه
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      loading: false,
      valid: false,
      formData: {
        deviceType: 0,
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
  created () {
    this.$nuxt.$on('error', () => {
      this.loading = false
    })
    this.$nuxt.$on('deviceAdded', () => {
      this.loading = false
      this.$toast.success('دستگاه با موفقیت اضافه شد!')
      this.$router.push('/dashboard/')
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('error')
    this.$nuxt.$off('deviceAdded')
  },
  methods: {
    submitNewDevice () {
      if (!this.$refs.addNewDeviceForm.validate()) {
        return false
      }
      this.$nuxt.$emit('postReq', 'user/add-new-device', 'deviceAdded', this.formData)
    }
  }
}
</script>
<style>

</style>
