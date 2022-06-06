<template>
  <v-card class="main-box-shadow h-100  overflow-hidden" rounded="xl" @click="toggleActive">
    <v-card-text class="h-100 py-2 relative">
      <v-container class="h-100" fluid>
        <v-row align="center" class="h-100">
          <v-col cols="3" class="pr-0">
            <v-img :src="`/svg/commands-icons/${command.name}.svg`" contain max-height="64px" />
          </v-col>
          <v-col cols="6" class="pr-0">
            <div class="text-body-1 font-weight-bold">
              {{ $store.getters['i18n/getTranslate'](command.name) }}
            </div>
            <div class="text-body-2 mt-3">
              {{ message }}
            </div>
          </v-col>
        </v-row>
      </v-container>
      <div class="confirm-btn" :class="{'active': active}" @click.stop="runCommand(command)">
        <div v-show="!loading" class="text-body-2 white--text">
          ارسال پیامک
        </div>
        <v-progress-circular
          v-show="loading"
          indeterminate
          color="white"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    command: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data () {
    return {
      active: false,
      loading: false,
      message: ''
    }
  },
  created () {
    this.$nuxt.$on(`messageReceived-${this.command.name}`, (message) => {
      this.active = false
      this.loading = false
      this.message = message
    })
    this.$nuxt.$on(`messageNotReceived-${this.command.name}`, (err) => {
      this.active = false
      this.loading = false
      this.message = err
    })
  },
  beforeDestroy () {
    this.$nuxt.$off(`messageReceived-${this.command.name}`)
    this.$nuxt.$off(`messageNotReceived-${this.command.name}`)
  },
  methods: {
    toggleActive () {
      this.active = !this.active
    },
    runCommand (command) {
      this.loading = true
      this.message = ''
      this.$emit('run', command)
    }
  }
}
</script>
<style>

</style>
