<template>
  <div class="battery">
    <div :class="`battery-level ${batteryClass}`" :style="`height:${batteryCharge}%;`" />
  </div>
</template>

<script>
export default {
  props: {
    batteryCharge: {
      type: Number,
      required: true
    }
  },
  computed: {
    batteryClass () {
      if (this.batteryCharge < 10) {
        return 'alert'
      } else if (this.batteryCharge < 20) {
        return 'warn'
      } else {
        return ''
      }
    }
  }
}
</script>

<style>

</style>
