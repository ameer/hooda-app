export const state = () => ({
  onlineStatus: false,
  devices: [],
  selectedDevice: null,
  isKeyboardShown: false
})

export const mutations = {
  changeOnlineStatus (state, status) {
    state.onlineStatus = status
  },
  setDevices (state, devices) {
    state.devices = devices
  },
  setSelectedDevice (state, device) {
    state.selectedDevice = device
  },
  setKeyboardShown (state, status) {
    state.isKeyboardShown = status
  }
}
