export default async function ({ app, store, route, redirect }) {
    const isStaff = store.getters['auth/isStaff']
    const allowedProjectId = store.getters['user/getCurrentlyAllowedProjectId'] || -1
    const openedProjectId = route.params.id
    if(openedProjectId && String(openedProjectId) !== "undefined" && !isStaff) {
        const progress = await app.$services.metrics.fetchMyProgress(openedProjectId)
        const canAccess = progress.remaining > 0 && progress.total > 0 && allowedProjectId.toString() === openedProjectId
        if (!canAccess) {
            return redirect('/projects')
        }
    }
}