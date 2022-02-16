export const state = () => ({
  currentPassword: '0000',
  setAdmin: '$currentPassword hooda admin $adminIndex $mobile',
  resetFactory: '$currentPassword freset',
  activateAntiTheft: '$currentPassword on',
  deactivateAntiTheft: '$currentPassword off',
  changeDevicePassword: '$currentPassword $newPassword $currentPassword',
  simCardCredit: '$currentPassword credit',
  deviceAntenQuality: '$currentPassword antenna',
  getTemperature: '$currentPassword temp',
  getAdminList: '$currentPassword radmin'
})
export const mutations = {
  setCurrentPassword (state, password) {
    state.currentPassword = password
  }
}
export const getters = {
  getCommand: state => (command, adminIndex = 1) => {
    let commandString = (state[command]).replace('$currentPassword', state.currentPassword)
    if (command === 'setAdmin') {
      commandString = commandString.replace('$adminIndex', adminIndex)
    }
    return commandString
  },
  getUserCommands: state => () => {
    const commandsArray = []
    for (const command in state) {
      if (command !== 'currentPassword' && command !== 'setAdmin') {
        commandsArray.push({
          name: command,
          value: (state[command]).replace('$currentPassword', state.currentPassword)
        })
      }
    }
    return commandsArray
  }
}
