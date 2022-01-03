import colors from 'vuetify/es5/util/colors'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
export default {
  rtl: true,
  icons: {
    iconfont: 'mdi' // default - only for display purposes
  },
  theme: {
    dark: false,
    themes: {
      light: {
        accent: '#fbfbfd',
        primary: '#006090'
      },
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
}