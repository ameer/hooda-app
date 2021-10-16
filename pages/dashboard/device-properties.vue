<template>
  <v-container>
    <div class="text-center">
      <h4 class="text--primary mb-2">
        ثبت مشخصات دستگاه
      </h4>
    </div>
    <v-divider class="my-4" />
    <v-row align="center">
      <v-col cols="3">
        <div class="img-container mb-4">
          <v-img contain :src="`/${device}.svg`" />
        </div>
      </v-col>
      <v-col v-if="device !== ''" cols="9">
        <p class="text--primary mb-1 text-center">
          {{ items[device].title }}
        </p>
        <p class="text--secondary font-weight-light text-center">
          {{ items[device].subtitle }}
        </p>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
        <v-text-field
          dir="auto"
          filled
          flat
          type="number"
          label="شماره سیم کارت داخل دستگاه"
          prepend-inner-icon="mdi-sim-outline"
          rounded
          hide-details="auto"
        />
      </v-col>
      <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
        <v-text-field
          dir="auto"
          filled
          flat
          type="number"
          label="بارکد محصول"
          hint="بارکد روی کارت گارانتی داخل جعبه محصول درج شده است"
          persistent-hint
          prepend-inner-icon="mdi-barcode"
          rounded
          hide-details="auto"
        />
      </v-col>
      <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
        <v-text-field
          dir="auto"
          filled
          flat
          type="text"
          label="محل نصب دستگاه"
          hint="در محل نصب هر اسمی که می‌خواهید وارد کنید. به عنوان مثال: خانه، کارگاه، مغازه و ..."
          persistent-hint
          prepend-inner-icon="mdi-home-outline"
          rounded
          hide-details="auto"
        />
      </v-col>
      <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
        <v-btn
          block
          large
          rounded
          color="primary"
          :loading="loading"
          @click="submit"
        >
          ثبت اطلاعات
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      device: '',
      items: {
        payesh: {
          title: 'دستگاه هوشمند پایش محیط',
          subtitle: 'تشخیص دود و دزدگیر'
        },
        smoke: {
          title: 'دستگاه هوشمند تشخیص دود',
          subtitle: ''
        },
        antiTheft: {
          title: 'دزدگیر هوشمند',
          subtitle: ''
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
