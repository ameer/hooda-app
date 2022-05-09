export default function ({ $axios, redirect, $auth }) {
  $axios.onError((error) => {
    if (!error.response) { // network error
      return Promise.reject(error)
    } else if (error.response.status === 401) {
      if ($auth.loggedIn) {
        $auth.logout()
      } else {
        redirect('/auth/login')
      }
    }
    return Promise.reject(error)
  })
}
