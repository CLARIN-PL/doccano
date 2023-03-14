import _ from 'lodash'

export default _.debounce(async function ({ app, store, route, redirect }) {
  try {
    await store.dispatch('projects/setCurrentProject', route.params.id)
<<<<<<< HEAD
  } catch (e) {
    redirect('/projects')
  }
=======
    await store.dispatch('projects/setCurrentDimensions', route.params.id)
  } catch (e) {
    redirect('/projects')
  }
  
>>>>>>> 0a47715c (feat: dimensions fe (in progress))
  const isProjectAdmin = await app.$services.member.isProjectAdmin(route.params.id)
  const projectRoot = app.localePath('/projects/' + route.params.id)
  const path = route.fullPath.replace(/\/$/g, '')

  if (isProjectAdmin || path === projectRoot || path.startsWith(projectRoot + '/dataset')) {
    return
  }

  return redirect(projectRoot)
}, 1000)
