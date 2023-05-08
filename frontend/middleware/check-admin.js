export default async function ({ app, store, route, redirect }) {
  try {
    await store.dispatch('projects/setCurrentProject', route.params.id)
    await store.dispatch('projects/setCurrentDimensions', route.params.id)
    await store.dispatch('projects/setAllDimensions')

  } catch (e) {
    redirect('/projects')
  }
  
  let isProjectAdmin = await app.$services.member.isProjectAdmin(route.params.id)
  let projectRoot = app.localePath('/projects/' + route.params.id)
  const path = route.fullPath.replace(/\/$/g, '')
  
  if(route.params.id) {
    isProjectAdmin = await app.$services.member.isProjectAdmin(route.params.id)
    projectRoot = app.localePath('/projects/' + route.params.id)
  }
  
  if (isProjectAdmin || path === projectRoot || path.startsWith(projectRoot + '/dataset')) {
    return
  }


  return redirect(projectRoot)
}
