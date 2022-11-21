export default function ({ store, route }) {
    const isStaff = store.getters['auth/isStaff']
    const toShow = store.getters['user/getQuestionnaire'].toShow
    if(!isStaff && toShow.length && !route.path.startsWith("/questionnaires")) {
        return redirect("/questionnaires")
    }
}