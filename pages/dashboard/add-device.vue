<template>
  <v-container>
    <h4 class="text--primary mb-4 text-center">
      نوع دستگاه خود را انتخاب کنید:
    </h4>
    <v-row align="center" justify="center" class="mt-4">
      <v-col cols="12" sm="6" md="4" class="text-center">
        <nuxt-link class="text-decoration-none" to="/dashboard/device-properties/?device=payesh">
          <div class="img-container mb-4">
            <v-img contain src="/payesh.svg" />
          </div>
          <p class="text--primary mb-1 text-center">
            دستگاه هوشمند پایش محیط
          </p>
          <p class="text--secondary font-weight-light text-center">
            تشخیص دود و دزدگیر
          </p>
        </nuxt-link>
      </v-col>
      <v-col cols="12" sm="6" md="4" class="text-center">
        <nuxt-link class="text-decoration-none" to="/dashboard/device-properties/?device=smoke">
          <div class="img-container mb-4">
            <v-img contain src="/smoke.svg" />
          </div>
          <p class="text--primary mb-1 text-center">
            دستگاه هوشمند تشخیص دود
          </p>
        </nuxt-link>
      </v-col>
      <v-col cols="12" sm="6" md="4" class="text-center">
        <nuxt-link class="text-decoration-none" to="/dashboard/device-properties/?device=antiTheft">
          <div class="img-container mb-4">
            <v-img contain src="/antiTheft.svg" />
          </div>
          <p class="text--primary mb-1 text-center">
            دزدگیر هوشمند
          </p>
        </nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {

}
</script>
<style>

</style>
