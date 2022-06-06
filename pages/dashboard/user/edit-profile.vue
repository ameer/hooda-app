<template>
  <v-container class="h-100 px-0">
    <v-card rounded="xl" class="device-card">
      <v-form ref="userEditForm" :valid="valid" @submit.prevent="submit">
        <v-card-text>
          <v-text-field
            v-for="(field, index) in fieldsToShow"
            :key="`user-field-${index}`"
            v-model="formData[field.key]"
            :readonly="field.readonly"
            outlined
            rounded
            :label="$store.getters['i18n/getTranslate'](field.key)"
            dir="auto"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit">
            ذخیره
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
      valid: false,
      fieldsToShow: [{ key: 'fullname' }, { key: 'city' }, { key: 'phone' }, { key: 'email' }],
      formData: {}
    }
  },
  computed: {
    user () {
      return this.$auth.user
    }
  },
  mounted () {
    if (this.user && this.user.id) {
      this.formData = this.user
    }
  },
  methods: {
    submit () {
      console.log(this.formData)
    }
  }
}
</script>
<style>

</style>
