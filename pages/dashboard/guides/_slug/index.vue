<template>
  <section id="single-guide-page">
    <v-card>
      <v-card-title>
        {{ article.title }}
      </v-card-title>
      <v-card-text class="text-body-2">
        <nuxt-content :document="article" />
      </v-card-text>
      <v-card-actions>
        <v-btn nuxt href="https://hoodaiot.ir" block color="primary" target="_blank">
          مراجعه به وبسایت
        </v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>
<script>
export default {
  layout: 'dashboard',
  async asyncData ({ $content, params }) {
    const article = await $content('guides', params.slug).fetch()

    return { article }
  }
}
</script>
<style>

</style>
