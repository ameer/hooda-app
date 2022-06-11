<template>
  <v-app>
    <v-container class="h-100">
      <v-row justify="center" class="h-100">
        <v-col cols="12" sm="9" md="6" lg="4" class="h-100 text-center">
          <div v-if="error.statusCode === 404" class="text--secondary">
            <h1>
              {{ pageNotFound }}
            </h1>
          </div>
          <div v-else class="text--secondary">
            <h1>
              {{ error }}
            </h1>
          </div>
          <v-btn color="green darken-1" class="mt-8" dark @click="backOrReload">
            بازگشت به صفحه قبل
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'صفحه موردنظر در دسترس نیست',
      otherError: 'خطایی در اپلیکیشن رخ داده است.'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  methods: {
    backOrReload () {
      if (this.error.statusCode === 404) {
        this.$router.go(-1)
      } else {
        this.$router.go(this.$router.currentRoute)
      }
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
