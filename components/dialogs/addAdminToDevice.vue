<template>
  <v-dialog
    :value="dialog"
    persistent
    transition="dialog-bottom-transition"
    fullscreen
    max-width="320"
  >
    <v-card tile>
      <confirm-action
        :dialog="confirmDialog"
        :dialog-message="dialogMessage"
        :dialog-title="dialogTitle"
        :switch-buttons="false"
        @closeDialog="confirmDialog = false"
        @actionConfirmed="actionConfirmed"
      />
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>افزودن مدیر {{ adminIndexInFa[adminIndex] }} به دستگاه</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-form ref="addAdminForm" v-model="valid" @submit.prevent="submitAdmin">
        <v-card-text class="mt-4">
          <p class="text-body-1 line-height-x2 text-justify">
            در این قسمت شما می‌توانید یک کاربر را به لیست مدیران دستگاه اضافه کنید. این کاربر پس از نصب اپلیکیشن و تکمیل اطلاعات فردی می‌تواند این دستگاه را در فهرست دستگاه‌های خود مشاهده کند.
          </p>

          <v-text-field
            v-model="formData.phone"
            dir="auto"
            outlined
            flat
            type="tel"
            maxlength="11"
            minlength="11"
            label="شماره موبایل"
            prepend-inner-icon="mdi-phone"
            :rules="[rules.required, rules.validMobile]"
            rounded
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="green darken-1"
            dark
            rounded
            x-large
            type="submit"
            width="320"
            :loading="loading"
            :disabled="!valid"
          >
            <span class="text-h6 font-weight-bold">ثبت مدیر {{ adminIndexInFa[adminIndex] }}</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import confirmAction from './confirmAction.vue'
export default {
  components: { confirmAction },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    adminIndex: {
      type: Number,
      default: 2
    },
    deviceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      confirmDialog: false,
      dialogTitle: 'ارسال پیامک',
      dialogMessage: 'پس از تایید، پیامک ثبت این شماره به دستگاه ارسال خواهد شد. آیا مطمئن هستید؟',
      loading: false,
      valid: false,
      formData: {
        phone: ''
      },
      rules: {
        required: v => !!v || 'برای ادامه به شماره موبایل نیاز داریم.',
        validMobile: v => /^09\d{9}$/.test(v) || 'شماره موبایل صحیح نمی‌باشد.'
      },
      adminIndexInFa: [
        'اول',
        'دوم',
        'سوم'
      ]
    }
  },
  created () {
    this.$nuxt.$on('adminAdded', (resp) => {
      this.$toast.success(resp.data.message)
      this.$nuxt.$emit('saveDeviceToLocal', resp.data.device)
      this.$emit('updateDevice', resp.data.device)
      this.$emit('sendAdminSMS', this.formData.phone)
      this.closeDialog()
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('adminAdded')
  },
  methods: {
    submitAdmin () {
      if (!this.$refs.addAdminForm.validate()) {
        return false
      }
      this.loading = true
      this.confirmDialog = true
    },
    actionConfirmed () {
      this.$nuxt.$emit('postReq', `user/add-admin/${this.$route.params.id}`, 'adminAdded', this.formData)
    },
    closeDialog () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>

</style>
