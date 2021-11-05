<template>
  <v-container class="h-100 pa-0">
    <h4 class="text--primary mb-4 text-center">
      دستگاه‌های من
    </h4>
    <v-row align="start" justify="start" class="mt-4">
      <v-col cols="6" class="text-center">
        <nuxt-link
          class="text-decoration-none"
          to="/dashboard/device-panel/?device=payesh"
        >
          <div class="img-container mb-4">
            <v-img contain src="/payesh.svg" />
          </div>
          <p class="text--primary mb-1 text-center">
            دستگاه هوشمند پایش محیط
          </p>
          <p class="text--secondary font-weight-light text-center">
            کارگاه
          </p>
        </nuxt-link>
      </v-col>
      <v-col cols="6" class="text-center">
        <nuxt-link class="text-decoration-none" to="/dashboard/device-panel/?device=smoke">
          <div class="img-container mb-4">
            <v-img contain src="/smoke.svg" />
          </div>
          <p class="text--primary mb-1 text-center">
            دستگاه هوشمند تشخیص دود
          </p>
          <p class="text--secondary font-weight-light text-center">
            کارگاه۲
          </p>
        </nuxt-link>
      </v-col>
      <v-col cols="6" class="text-center">
        <nuxt-link class="text-decoration-none" to="/dashboard/device-panel/?device=antiTheft">
          <div class="img-container mb-4">
            <v-img contain src="/antiTheft.svg" />
          </div>
          <p class="text--primary mb-1 text-center">
            دزدگیر هوشمند
          </p>
          <p class="text--secondary font-weight-light text-center">
            خانه
          </p>
        </nuxt-link>
      </v-col>
    </v-row>
    <v-btn
      elevation="4"
      color="green"
      fab
      absolute
      class="fab bottom right"
      to="/dashboard/add-device"
      nuxt
    >
      <v-icon color="white">
        mdi-plus
      </v-icon>
    </v-btn>
  </v-container>
</template>
<script>
export default {}
</script>
<style>
</style>
