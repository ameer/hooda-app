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
        @closeDialog="closeConfirmDialog"
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
        <v-toolbar-title>تغییر رمز عبور دستگاه</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-form ref="changePasswordForm" v-model="valid" @submit.prevent="submitNewPassword">
        <v-card-text class="mt-4">
          <p class="text-body-1 line-height-x2 text-justify">
            در این قسمت شما می‌توانید رمز عبور جدید را برای دستگاه خود وارد کنید.
          </p>
          <v-text-field
            v-model="formData.currentPassword"
            dir="auto"
            outlined
            flat
            type="password"
            maxlength="4"
            minlength="4"
            label="رمز فعلی"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required, rules.valid4digitsPassword]"
            rounded
          />
          <v-text-field
            v-model="formData.newPassword"
            dir="auto"
            outlined
            flat
            type="password"
            maxlength="4"
            minlength="4"
            label="رمز عبور جدید"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required, rules.valid4digitsPassword]"
            rounded
          />
          <v-text-field
            v-model="formData.newPassword_confirmation"
            dir="auto"
            outlined
            flat
            type="password"
            maxlength="4"
            minlength="4"
            label="تکرار رمز عبور جدید"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required, rules.valid4digitsPassword]"
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
            <span class="text-h6 font-weight-bold">تغییر رمز عبور دستگاه</span>
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
      dialogMessage: 'پس از تایید، پیامک ثبت این رمز به دستگاه ارسال خواهد شد. آیا مطمئن هستید؟',
      loading: false,
      valid: false,
      formData: {
        phone: ''
      },
      rules: {
        required: v => !!v || 'برای ادامه به رمز عبور نیاز داریم.',
        valid4digitsPassword: v => /^\d{4}$/.test(v) || 'رمز عبور باید ۴ رقم باشد.'
      }
    }
  },
  created () {
    this.$nuxt.$on('devicePasswordChanged', (resp) => {
      this.$toast.success(resp.data.message)
      this.$nuxt.$emit('saveDeviceToLocal', resp.data.device)
      this.$emit('updateDevice', resp.data.device)
      this.$store.dispatch('commands/setPassword', resp.data.device.psw)
      this.$emit('sendChangePasswordSMS', this.formData.newPassword)
      this.closeDialog()
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('devicePasswordChanged')
  },
  methods: {
    submitNewPassword () {
      if (!this.$refs.changePasswordForm.validate()) {
        return false
      }
      this.loading = true
      this.confirmDialog = true
    },
    actionConfirmed () {
      this.$nuxt.$emit('postReq', `user/change-device-password/${this.$route.params.id}`, 'devicePasswordChanged', this.formData)
    },
    closeConfirmDialog () {
      this.loading = false
      this.confirmDialog = false
    },
    closeDialog () {
      this.$refs.changePasswordForm.reset()
      this.closeConfirmDialog()
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>

</style>
