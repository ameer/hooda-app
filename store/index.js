export const state = () => ({
  onlineStatus: false,
  devices: []
})

export const mutations = {
  changeOnlineStatus (state, status) {
    state.onlineStatus = status
  },
  setDevices (state, devices) {
    state.devices = devices
  }
}
