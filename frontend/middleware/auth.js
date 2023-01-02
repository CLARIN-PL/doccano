export default function ({ route, store, redirect }) {
  const outerPages = ["/", "/auth"]
  const isDemoPage = route.path.startsWith("/demo")
  if (!store.getters['auth/isAuthenticated'] && !outerPages.includes(route.path) && !isDemoPage) {
    redirect('/auth')
  }
}
