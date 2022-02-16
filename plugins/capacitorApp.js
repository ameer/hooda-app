import { App } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
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
  App.addListener('backButton', async () => {
    if (app.router.currentRoute.path === '/') {
    //   App.exitApp()
      alert('exit')
    }
    if (counter === 0) {
      counter++
      setTimeout(() => {
        counter = 0
      }, 2500)
      app.router.go(-1)
    } else if (counter === 1 && app.router.currentRoute.path !== '/') {
      counter++
      setTimeout(() => {
        counter = 0
      }, 2500)
      await Toast.show({ text: 'برای خروج دوباره دکمه بازگشت را بزنید!' })
    } else {
      counter = 0
      //   App.exitApp()
      alert('exit')
    }
  })
}
