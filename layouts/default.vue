<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      right
      app
    >
      <v-img
        src="/logo-fa-text-below.svg"
        contain
        max-width="85px"
        class="mx-auto mt-4"
      />
      <v-divider class="mt-4" />
      <v-list class="">
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app elevation="0" color="#fbfbfd">
      <v-app-bar-nav-icon class="text--primary" @click.stop="drawer = !drawer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            fill="rgb(0 0 0 / 87%)"
            d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z"
          />
        </svg>
      </v-app-bar-nav-icon>
      <v-toolbar-title
        class="pr-0 font-weight-bold primary--text"
        v-text="title"
      />
      <v-spacer />
      <v-btn
        elevation="0"
        small
        fab
        color="accent"
        nuxt
        to="/dashboard/my-devices"
      >
        <v-icon color="primary">
          mdi-home-outline
        </v-icon>
      </v-btn>
      <v-btn elevation="0" small fab color="accent" @click="goBack">
        <v-icon color="primary">
          mdi-arrow-u-left-bottom
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="accent">
      <v-container class="h-100">
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-cellphone-link',
          title: 'دستگاه‌های من',
          to: '/'
        },
        {
          icon: 'mdi-share-variant-outline',
          title: 'معرفی به دوستان',
          to: '/'
        },
        {
          icon: 'mdi-phone-outline',
          title: 'ارتباط با ما',
          to: '/'
        },
        {
          icon: 'mdi-help',
          title: 'راهنما',
          to: '/'
        },
        {
          icon: 'mdi-cog-outline',
          title: 'تنظیمات',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'هــودا'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
