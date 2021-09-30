<template>
  <v-container class="pt-0">
    <v-img
      src="/svg/otp.svg"
      max-height="256px"
      contain
      class="mb-4 rounded-xl"
    />
    <p class="text--secondary text-body-2">
      یک کد ۴ رقمی به شماره زیر ارسال شده است:
    </p>
    <p />
    <v-row align="center">
      <v-col cols="12" sm="6" offset-sm="3">
        <v-text-field
          filled
          class="rtl"
          flat
          type="number"
          label="شماره موبایل"
          prepend-inner-icon="mdi-phone"
          rounded
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  auth: 'guest'
}
</script>

<style>
</style>
