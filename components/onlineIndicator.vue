<template>
  <v-tooltip v-model="showTooltip" bottom :color="online ? 'primary' : 'warning'" open-on-hover close-delay="500">
    <template #activator="{ on, attrs }">
      <span
        v-bind="attrs"
        class="connection-indicator ml-3"
        :class="online ? 'online magicGreen' : 'red darken-2'"
        v-on="on"
      />
    </template>
    <span>دسترسی به اینترنت برقرار {{ online ? "است" : "نیست" }}.</span>
  </v-tooltip>
</template>

<script>
export default {
  data () {
    return {
      showTooltip: null
    }
  },
  computed: {
    online () {
      return this.$store.state.onlineStatus
    }
  },
  watch: {
    online () {
      this.showTooltip = true
      setTimeout(() => {
        this.showTooltip = false
      }, 4000, this)
    }
  }
}
</script>

<style>

</style>
