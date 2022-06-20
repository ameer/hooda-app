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
        color="error darken-2"
      >
        <v-btn
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>حذف مدیر از دستگاه</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-form ref="removeAdminForm" v-model="valid" @submit.prevent="removeAdmin">
        <v-card-text class="mt-4">
          <p class="text-body-1 line-height-x2 text-justify">
            در این قسمت شما می‌توانید شماره مدیران ۲ و ۳ را از حافظه دستگاه پاک کنید.
          </p>
          <div>
            <p class="text-body-2 text--secondary px-3">
              مدیر موردنظر را جهت حذف انتخاب کنید:
            </p>
            <v-radio-group
              v-model.number="adminIndex"
              row
              label=""
              :rules="[rules.required]"
            >
              <v-radio
                label="مدیر دوم"
                :value="2"
              />
              <v-radio
                label="مدیر سوم"
                :value="3"
              />
            </v-radio-group>
          </div>
          <v-text-field
            v-model="formData.phone"
            dir="auto"
            outlined
            flat
            type="tel"
            maxlength="11"
            minlength="11"
            :label="`شماره موبایل مدیر ${adminIndexInFa[adminIndex - 1]}`"
            prepend-inner-icon="mdi-phone"
            :rules="[rules.required, rules.validMobile]"
            rounded
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="error darken-1"
            dark
            rounded
            x-large
            type="submit"
            width="320"
            :loading="loading"
            :disabled="!valid"
          >
            <span class="text-h6 font-weight-bold">حذف مدیر {{ adminIndexInFa[adminIndex - 1] }}</span>
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
    deviceId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      adminIndex: 2,
      confirmDialog: false,
      dialogTitle: 'ارسال پیامک',
      dialogMessage: 'پس از تایید، پیامک حذف این شماره به دستگاه ارسال خواهد شد. آیا مطمئن هستید؟',
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
    this.$nuxt.$on('adminRemoved', (resp) => {
      this.$toast.success(resp.data.message)
      this.$nuxt.$emit('saveDeviceToLocal', resp.data.device)
      this.$emit('updateDevice', resp.data.device)
      this.$emit('sendRemoveAdminSMS', this.adminIndex, this.formData.phone)
      this.closeDialog()
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('adminRemoved')
  },
  methods: {
    removeAdmin () {
      if (!this.$refs.removeAdminForm.validate()) {
        return false
      }
      this.loading = true
      this.confirmDialog = true
    },
    actionConfirmed () {
      this.$nuxt.$emit('postReq', `user/remove-admin/${this.$route.params.id}`, 'adminRemoved', this.formData)
    },
    closeConfirmDialog () {
      this.loading = false
      this.confirmDialog = false
    },
    closeDialog () {
      this.$refs.removeAdminForm.reset()
      this.adminIndex = 2
      this.closeConfirmDialog()
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>

</style>
