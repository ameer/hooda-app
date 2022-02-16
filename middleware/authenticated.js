export default function ({ $auth, redirect, route, next }) {
  const tokenStatus = $auth.strategy.token.status()
  if (tokenStatus.unknown() || tokenStatus.expired()) {
    console.log('Unknown or Expired Token')
    $auth.$storage.removeUniversal('user')
    if (route.name.startsWith('auth')) {
      return next
    } else {
      return redirect('/auth/login')
    }
  } else {
    console.log('Valid Token')
    const user = $auth.$storage.getUniversal('user')
    $auth.setUser(user)
    if (route.name.startsWith('auth')) {
      return redirect('/dashboard')
    } else {
      return next
    }
  }
//   if (!tokenStatus.unknown() || !tokenStatus.expired()) {
//     const user = $auth.$storage.getUniversal('user')
//     if (typeof user === 'object') {
//       $auth.setUser(user)
//       return redirect('/dashboard')
//     } else {
//       return next
//     }
//   }
  //   console.log(route)
//   if (route.name.startsWith('auth')) {
//     return next
//   } else {
//     const tokenStatus = $auth.strategy.token.status()
//     if (tokenStatus.unknown() || tokenStatus.expired()) {
//       $auth.$storage.removeUniversal('user')
//       return redirect('/auth/login')
//     }
//   }
//   const expired = $auth.strategy.token.status().expired()
//   if (expired) {
//     $auth.$storage.removeUniversal('user')
//     return redirect('/auth/login')
//   }
//   const user = $auth.$storage.getUniversal('user')
//   if (typeof user === 'object') {
//     return redirect('/dashboard')
//   } else {
//     return redirect('/auth/login')
//   }
}
