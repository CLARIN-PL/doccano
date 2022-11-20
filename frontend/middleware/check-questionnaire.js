export default function ({ store, redirect }) {
    const isStaff = store.getters['auth/isStaff']
    const toShow = store.getters['user/getQuestionnaire'].toShow
    if(!isStaff && toShow.length) {
        return redirect("/questionnaires")
    }
}