export default async function ({ route, store }) {
  const outerPages = ["/", "/auth"]
  const isDemoPage = route.path.startsWith("/demo")
  const isOuterPage = outerPages.includes(route.path) || isDemoPage 
  const hasIncompleteData = !store.getters['auth/isAuthenticated'] || !store.getters['auth/getUsername']
  if (!isOuterPage && hasIncompleteData) {
    await store.dispatch('auth/initAuth')
    store.dispatch('user/init', store.getters['auth/getUserId'])
  }
}
