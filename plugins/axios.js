export default function ({ $axios, redirect, $auth }) {
  $axios.onError((error) => {
    if (error.response.status === 401) {
      if ($auth.loggedIn) {
        $auth.logout()
      } else {
        redirect('/auth/login')
      }
    }
  })
}
