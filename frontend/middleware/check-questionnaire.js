export default function ({ store, redirect }) {
    // const isStaff = store.getters['auth/isStaff']
    const toShow = store.getters['user/getQuestionnaire'].toShow
    console.log(toShow)
    if(toShow.length) {
        return redirect("/questionnaires")
    }
}