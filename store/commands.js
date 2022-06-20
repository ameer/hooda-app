export const state = () => ({
  currentPassword: '0000',
  commands: {
    setAdmin: { sms: '$currentPassword*hooda*admin*$adminIndex*$mobile', isAction: false },
    activateAntiTheft: { sms: '$currentPassword*on', isAction: false },
    deactivateAntiTheft: { sms: '$currentPassword*off', isAction: false },
    getTemperature: { sms: '$currentPassword*temp', isAction: false },
    simCardCredit: { sms: '$currentPassword*credit', isAction: false },
    deviceAntenQuality: { sms: '$currentPassword*antenna', isAction: false },
    getAdminList: { sms: '$currentPassword*radmin', isAction: false },
    removeAdmin: { sms: '$currentPassword*hooda*admin*$adminIndex*0', isAction: true, action: 'removeAdmin', needsInternet: true },
    // resetFactory: { sms: '$currentPassword*freset', isAction: false, needConfirm: true, confirmMessage: 'آیا از انجام این عمل اطمینان دارید؟ کلیه اطلاعات دستگاه پاک خواهد شد.', confirmTitle: 'تایید بازگشت به تنظیمات کارخانه' },
    changeDevicePassword: { sms: '$currentPassword*np*$newPassword', isAction: true, action: 'changeDevicePassword', needsInternet: true }
  }
})
export const mutations = {
  setCurrentPassword (state, password) {
    state.currentPassword = password
  }
}
export const getters = {
  getCommand: state => (command) => {
    let commandString = (state.commands[command.name].sms).replaceAll('$currentPassword', state.currentPassword)
    if (command.name === 'setAdmin') {
      commandString = commandString.replace('$adminIndex', command.adminIndex)
      commandString = commandString.replace('$mobile', command.adminPhone)
    }
    if (command.name === 'removeAdmin') {
      commandString = commandString.replace('$adminIndex', command.adminIndex)
    }
    return commandString
  },
  getUserCommands: state => () => {
    const commandsArray = []
    for (const command in state.commands) {
      if (command !== 'setAdmin') {
        commandsArray.push({
          name: command,
          value: (state.commands[command].sms).replace('$currentPassword', state.currentPassword),
          ...state.commands[command]
        })
      }
    }
    return commandsArray
  }
}
export const actions = {
  setPassword ({ commit }, password) {
    commit('setCurrentPassword', password)
  }
}
