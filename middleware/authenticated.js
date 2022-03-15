export default function ({ $auth, redirect, route, next }) {
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
    $auth.setUser(user)
    if (route.name.startsWith('auth')) {
      return redirect('/dashboard')
    } else {
      return next
    }
  }
}
