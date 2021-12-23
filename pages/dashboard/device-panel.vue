<template>
  <v-container class="h-100">
    <div class="text-center">
      <h4 class="text--primary mb-2">
        کنترل پنل هودا
      </h4>
    </div>
    <v-divider class="my-4" />
    <v-row align="center">
      <v-col v-if="device !== ''" cols="12">
        <p class="text--primary mb-1 text-center">
          {{ items[device].title }}
        </p>
        <p class="text--secondary font-weight-light text-center">
          {{ items[device].subtitle }}
        </p>
        <p class="text--primary mb-1 text-center">
          شماره سیمکارت داخل دستگاه: ۰۹۳۹۱۲۳۴۵۶۷
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <gauge />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import gauge from '~/components/gauge.vue'
export default {
  components: { gauge },
  layout: 'dashboard',
  data () {
    return {
      loading: false,
      device: '',
      items: {
        payesh: {
          title: 'دستگاه هوشمند پایش محیط',
          subtitle: 'کارگاه'
        },
        smoke: {
          title: 'دستگاه هوشمند تشخیص دود',
          subtitle: 'کارگاه۲'
        },
        antiTheft: {
          title: 'دزدگیر هوشمند',
          subtitle: 'خانه'
        }
      }
    }
  },
  mounted () {
    this.device = this.$route.query.device
  },
  methods: {
    submit () {
      const self = this
      self.loading = true
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          self.loading = false
          this.$router.push('/dashboard/my-devices')
          resolve('foo')
        }, 1000)
      })
    }
  }
}
</script>
<style>

</style>
