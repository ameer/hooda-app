import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
  // "server": {
  //   "url": "http://192.168.1.55:3000",
  //   "cleartext": true
  // },
  appId: 'io.smartguard.app',
  appName: 'Smart Guard',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
