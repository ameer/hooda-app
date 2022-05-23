export const state = () => ({
  onlineStatus: false,
  devices: {},
  selectedDevice: null,
  isKeyboardShown: false,
  platform: 'web',
  loading: false
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
  }
}
