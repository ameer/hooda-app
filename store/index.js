/* eslint-disable no-console */
import { Sim } from '@ionic-native/sim'
// eslint-disable-next-line no-unused-vars
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever'
export const state = () => ({
  appVersion: '1.0.9',
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
  isScanningBarcode: false,
  timeoutId: null,
  updateURL: 'https://api.hoodaiot.ir/app/latest'
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
  },
  setTimeoutId (state, id) {
    state.timeoutId = id
  },
  setUpdateURL (state, url) {
    state.updateURL = url
  }
}
export const actions = {
  async checkIsDualSIM ({ commit, state }, { $toast }) {
    if (state.platform !== 'web') {
      const res = await Sim.hasReadPermission()
      if (!res) {
        AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.READ_PHONE_STATE).then((res) => {
          AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.READ_PHONE_STATE).then((res) => {
            if (res.hasPermission) {
              commit('setDualSIM', true)
            } else {
              commit('setDualSIM', false)
            }
          })
        }).catch((err) => {
          console.log(err)
          $toast.error('برای ادامه نیاز به دسترسی به سیم کارت داریم.'); return false
        })
        // if (!permission.hasPermission) {
        //   $toast.error('برای ادامه نیاز به دسترسی به سیم کارت داریم.'); return false
        // }
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
  checkNeedsUpdate ({ commit, state, dispatch }, { $axios, $toast }) {
    $axios.get('app/version')
      .then(async (res) => {
        const verCompare = await dispatch('semVerCompare', [res.data.version, state.appVersion])
        console.log(verCompare, res.data.version, state.appVersion)
        if (res.data.needsUpdate && verCompare === 1) {
          commit('setNeedsUpdate', res.data.needsUpdate)
          commit('setUpdateURL', res.data.updateURL)
        }
        if (res.data.showMessage) {
          $toast.info(res.data.message, {
            timeout: 0,
            singleton: true
          })
        }
      })
      .catch(error => console.error(error))
  },
  semVerCompare (context, payload) {
    // -1: a < b
    //  0: a == b
    //  1: a > b
    const [a, b] = payload
    if (a.startsWith(b + '-')) { return -1 }
    if (b.startsWith(a + '-')) { return 1 }
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' })
  },
  watchingForSMS ({ commit, state }, isWatching) {
    commit('setIsWatchingForSMS', isWatching)
    if (isWatching) {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId)
      }
      const timeoutId = window.setTimeout(() => {
        commit('setIsWatchingForSMS', false)
      }, 60000)
      commit('setTimeoutId', timeoutId)
    } else {
      clearTimeout(state.timeoutId)
      commit('setTimeoutId', null)
    }
  }
}
