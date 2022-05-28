export const state = () => ({
  currentPassword: '0000',
  setAdmin: '$currentPassword*hooda*admin*$adminIndex*$mobile',
  activateAntiTheft: '$currentPassword*on',
  deactivateAntiTheft: '$currentPassword*off',
  getTemperature: '$currentPassword*temp',
  simCardCredit: '$currentPassword*credit',
  deviceAntenQuality: '$currentPassword*antenna',
  getAdminList: '$currentPassword*radmin',
  removeAdmin: '$currentPassword*hooda*admin*$adminIndex*0',
  resetFactory: '$currentPassword*freset',
  changeDevicePassword: '$currentPassword*np*$newPassword'
})
export const mutations = {
  setCurrentPassword (state, password) {
    state.currentPassword = password
  }
}
export const getters = {
  getCommand: state => (command, adminIndex = 1) => {
    let commandString = (state[command]).replaceAll('$currentPassword', state.currentPassword)
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
