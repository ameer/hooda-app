export const state = () => ({
  onlineStatus: false,
  devices: [],
  selectedDevice: null,
  isKeyboardShown: false,
  platform: 'web'
})

export const mutations = {
  changeOnlineStatus (state, status) {
    state.onlineStatus = status
  },
  addToDevices (state, device) {
    state.devices.push(device)
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
