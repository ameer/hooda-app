/* eslint-disable no-console */
import { Sim } from '@ionic-native/sim'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
export const state = () => ({
  appVersion: '1.0.0',
  onlineStatus: false,
  devices: {},
  selectedDevice: null,
  isKeyboardShown: false,
  isDualSIM: false,
  platform: 'web',
  loading: false,
  appHash: '',
  needsUpdate: false,
  isWatchingForSMS: false,
  isScanningBarcode: false
})

export const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  changeOnlineStatus (state, status) {
    state.onlineStatus = status
  },
  updateDevicesList (state, device) {
    state.devices[device.uuid] = device
  },
  removeDeviceFromListBYUUID (state, uuid) {
    delete state.devices[uuid]
  },
  setDevices (state, devices) {
    state.devices = devices
  },
  setSelectedDevice (state, device) {
    state.selectedDevice = device
  },
  setKeyboardShown (state, status) {
    state.isKeyboardShown = status
  },
  setPlatform (state, platform) {
    state.platform = platform
  },
  setDualSIM (state, status) {
    state.isDualSIM = status
  },
  setAppHash (state, hash) {
    state.appHash = hash
  },
  setNeedsUpdate (state, status) {
    state.needsUpdate = status
  },
  setIsWatchingForSMS (state, status) {
    state.isWatchingForSMS = status
  },
  setIsScanningBarcode (state, status) {
    state.isScanningBarcode = status
  }
}
export const actions = {
  async checkIsDualSIM ({ commit, state }, { $toast }) {
    if (state.platform !== 'web') {
      const res = await Sim.hasReadPermission()
      if (!res) {
        const permission = await AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.READ_PHONE_STATE)
        if (!permission.hasPermission) {
          $toast.error('برای ادامه نیاز به دسترسی به سیم کارت داریم.'); return false
        }
      }
      const simInfo = await Sim.getSimInfo()
      if (simInfo.phoneCount > 1 && simInfo.activeSubscriptionInfoCount > 1) {
        commit('setDualSIM', true)
      } else {
        commit('setDualSIM', false)
      }
    }
  },
  getAppHash ({ commit }) {
    try {
      SmsRetriever.getAppHash()
        .then(res => commit('setAppHash', res))
        .catch(error => console.error(error))
    } catch (error) {
      console.log(error)
    }
  },
  checkNeedsUpdate ({ commit }, { $axios, $toast }) {
    $axios.get('app/version')
      .then((res) => {
        commit('setNeedsUpdate', res.data.needsUpdate)
        if (res.data.showMessage) {
          $toast.info(res.data.message, {
            timeout: 0,
            singleton: true
          })
        }
      })
      .catch(error => console.error(error))
  }
}
