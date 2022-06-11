<template>
  <v-dialog
    :value="dialog"
    persistent
    max-width="320"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ dialogTitle }}
      </v-card-title>
      <v-card-text>
        {{ dialogMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :color="switchButtons ? 'green darken-1' : 'red darken-1'"
          text
          @click="closeDialog"
        >
          انصراف
        </v-btn>
        <v-btn
          :color="switchButtons ? 'red darken-1' : 'green darken-1'"
          text
          @click="confirmAction"
        >
          تایید
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: 'تایید حذف'
    },
    dialogMessage: {
      type: String,
      default: 'آیا از انجام این کار مطمئن هستید؟ این کار برگشت‌ناپذیر است.'
    },
    switchButtons: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    confirmAction () {
      this.$emit('actionConfirmed', true)
    },
    closeDialog () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>

</style>
