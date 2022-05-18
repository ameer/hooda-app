<template>
  <section id="guides-index-page">
    <div class="text-h5 font-weight-bold text--secondary mt-4 mb-2 text-center">
      راهنمای دستگاه
    </div>
    <v-container>
      <v-row align="stretch">
        <v-col v-for="(item, i) in guideItems" :key="`guide-item-${i}`" cols="6">
          <v-card class="main-box-shadow h-100" rounded="xl" min-height="163px" @click="$router.push(`/dashboard/guides/${item.file}`)">
            <div class="pa-4">
              <!-- <img :src="`/svg/guides-icons/${item.file}.svg`" contain> -->
              <LottieAnimation
                :path="`svg/guides-icons/${item.file}.json`"
                :speed="0.75"
                :loop="true"
              />
            </div>
            <v-card-text class="text-center">
              <span class="text-body-1 font-weight-bold">{{ item.title }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script>
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'
export default {
  components: { LottieAnimation },
  layout: 'dashboard',
  async asyncData ({ $content, params }) {
    const article = await $content('guides', params.slug).fetch()

    return { article }
  },
  data () {
    return {
      guideItems: [
        { title: 'آشنایی با دستگاه', file: 'intro' },
        { title: 'هشدارهای پیامکی', file: 'sms-warnings' },
        { title: 'استانداردهای محل نصب', file: 'install-standards' },
        { title: 'مراحل نصب', file: 'installation-steps' },
        { title: 'فعال‌سازی دستگاه از طریق اپلیکیشن', file: 'activate-device-using-app' },
        { title: 'گارانتی و خدمات پس از فروش', file: 'guarantee' },
        { title: 'تنظیم حسگرهای بی‌سیم', file: 'wireless-sensors' },
        { title: 'دستورهای پیامکی', file: 'sms-commands' }
      ]
    }
  },
  head () {
    return {
      title: 'راهنما'
    }
  }
}
</script>
<style>

</style>
