export default function ({ $auth, redirect, route, next, $axios }) {
  const tokenStatus = $auth.strategy.token.status()
  if (tokenStatus.unknown() || tokenStatus.expired()) {
    $auth.$storage.removeUniversal('user')
    if (route.name.startsWith('auth')) {
      return next
    } else {
      return redirect('/auth/login')
    }
  } else {
    const user = $auth.$storage.getUniversal('user')
    if (Object.keys(user).length === 0) {
      $axios.get('/user/profile', { withCredentials: true }).then(({ data }) => {
        $auth.setUser(data)
      })
    } else {
      $auth.setUser(user)
    }
    if (route.name.startsWith('auth')) {
      return redirect('/dashboard')
    } else {
      return next
    }
  }
}
