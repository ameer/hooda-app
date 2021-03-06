import { App } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
import { Keyboard } from '@capacitor/keyboard'
export default function ({ app, store }) {
  let counter = 0
  store.commit('changeOnlineStatus', navigator.onLine)
  window.addEventListener(
    'offline',
    function () {
      store.commit('changeOnlineStatus', false)
    }
  )
  window.addEventListener(
    'online',
    function () {
      store.commit('changeOnlineStatus', true)
    }
  )
  Keyboard.addListener('keyboardWillShow', () => {
    store.commit('setKeyboardShown', true)
  })
  Keyboard.addListener('keyboardDidHide', () => {
    store.commit('setKeyboardShown', false)
  })
  App.addListener('backButton', async () => {
    if (app.router.currentRoute.path === '/') {
      App.exitApp()
    }
    if (counter === 0) {
      counter++
      setTimeout(() => {
        counter = 0
      }, 2500)
      app.router.back()
    } else if (counter === 1 && app.router.currentRoute.path !== '/') {
      counter++
      setTimeout(() => {
        counter = 0
      }, 2500)
      await Toast.show({ text: 'برای خروج دوباره دکمه بازگشت را بزنید!' })
    } else {
      counter = 0
      App.exitApp()
    }
  })
}
