<template>
  <v-card rounded="xl" class="device-card relative">
    <v-card-text>
      <v-row align="center" dense no-gutters>
        <v-col cols="3">
          <v-img contain src="/ghome.png" max-height="64px" />
        </v-col>
        <v-col cols="9">
          <div
            class="text--primary text--darken-1 text-body-1 font-weight-bold mb-2"
          >
            پایش امنیت هوشمند <span class="faNum">#{{ i + 1 }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon right color="accent darken-1">
              mdi-map-marker-outline
            </v-icon>
            <div class="text-truncate">
              {{ device.location }}
            </div>
            <v-spacer />
            <v-icon left color="accent darken-1">
              mdi-sim-outline
            </v-icon>
            <div class="faNum">
              {{ device.sim_number }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="i >= 0">
      <v-btn
        color="primary"
        max-width="320px"
        width="50%"
        class="mx-auto"
        outlined
        rounded
        @click.prevent="
          setSelectedDevice(i, `/dashboard/device-panel/${device.id}`)
        "
      >
        <v-icon left>
          mdi-tune-vertical
        </v-icon>
        <span class="font-weight-bold text-body-2">پنل دستگاه</span>
      </v-btn>
      <v-spacer />
      <v-btn icon>
        <v-icon>
          mdi-square-edit-outline
        </v-icon>
      </v-btn>
    </v-card-actions>
    <!-- <v-card-title class="flex-column">
            <v-icon x-large color="primary lighten-2">
              mdi-shield-lock-outline
            </v-icon>
            <p class="text--primary mt-2 text-center">
              {{ device.location }}
            </p>
            <v-card-subtitle style="word-break: initial !important;">
              {{ deviceName[device.type] }}
            </v-card-subtitle>
          </v-card-title> -->
  </v-card>
</template>
<script>
export default {
  props: {
    device: {
      type: Object,
      required: true
    },
    i: {
      type: Number,
      required: true
    }
  },
  methods: {
    setSelectedDevice (i, path) {
      this.$store.commit('setSelectedDevice', i)
      this.$router.push(path)
    }
  }
}
</script>
<style></style>
