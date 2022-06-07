<template>
  <v-container class="h-100 px-0 pb-8">
    <div class="text-h5 font-weight-bold text--secondary my-4 text-center">
      ویرایش اطلاعات کاربری
    </div>
    <v-card rounded="xl" class="device-card">
      <v-form ref="userEditForm" v-model="valid" @submit.prevent="submit">
        <v-card-text>
          <v-text-field
            v-for="(field, index) in fieldsToShow"
            :key="`user-field-${index}`"
            v-model="formData[field.key]"
            :readonly="field.readonly"
            outlined
            rounded
            :rules="field.rules || []"
            :label="$store.getters['i18n/getTranslate'](field.key)"
            dir="auto"
          />
          <div v-if="isDualSIM">
            <p class="text-body-2 text--secondary px-3">
              سیم کارت پیش‌فرض جهت ارسال پیامک به دستگاه
            </p>
            <v-radio-group
              v-model.number="simCardSlot"
              row
              label=""
            >
              <v-radio
                label="سیم کارت ۱"
                :value="0"
              />
              <v-radio
                label="سیم کارت ۲"
                :value="1"
              />
            </v-radio-group>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            type="submit"
            width="320px"
            rounded
            large
            color="success"
            class="mx-auto my-4"
          >
            <span class="text-h6 font-weight-bold">بروزرسانی</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      loading: false,
      valid: false,
      formData: {},
      simCardSlot: 0,
      fieldsToShow: [
        { key: 'fullname', rules: [v => !!v || 'این فیلد الزامی است.'] },
        { key: 'city', rules: [v => !!v || 'این فیلد الزامی است.'] },
        { key: 'phone', readonly: true },
        { key: 'email' }
      ]
    }
  },
  computed: {
    user () {
      return this.$auth.user
    },
    isDualSIM () {
      return this.$store.state.isDualSIM
    }
  },
  created () {
    this.$nuxt.$on('userUpdated', (response) => {
      this.$auth.setUser(response.data.user)
      this.$toast.success(response.data.message)
      this.loading = false
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('userUpdated')
  },
  mounted () {
    this.$store.dispatch('checkIsDualSIM', this)
    if (this.user && this.user.id) {
      this.formData = JSON.parse(JSON.stringify(this.user))
      this.simCardSlot = this.user.simCardSlot ? this.user.simCardSlot : 0
    }
  },
  methods: {
    submit () {
      if (this.valid) {
        this.loading = true
        this.$nuxt.$emit('updateUser', 'simCardSlot', this.simCardSlot)
        this.$nuxt.$emit('putReq', 'user/update', 'userUpdated', this.formData)
      }
    }
  }
}
</script>
<style>

</style>
