export default async function ({ app, store, route, redirect }) {
    const isStaff = store.getters['auth/isStaff']
    if(route.params.id && !isStaff) {
        const progress = await app.$services.metrics.fetchMyProgress(route.params.id)
        const canAccess = progress.remaining > 0 && progress.total > 0
        if (!canAccess) {
            return redirect('/projects')
        } 
    }
}