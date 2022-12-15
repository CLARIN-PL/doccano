export default async function ({ store }) {
  if (!store.getters['auth/isAuthenticated'] || !store.getters['auth/getUsername']) {
    await store.dispatch('auth/initAuth')
    store.dispatch('user/initUser', store.getters['auth/getUserId'])
  }
}
