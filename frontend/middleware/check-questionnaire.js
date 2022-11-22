import { qCategories } from "~/utils/questionnaires"

export default function ({ store, route, redirect }) {
    // const isStaff = store.getters['auth/isStaff']
    const isStaff = false
    const {toShow} = store.getters['user/getQuestionnaire']
    if(toShow && Array.isArray(toShow) && toShow.length) {
        const isWorkingOnQuestionnaire = store.getters['user/getIsWorkingOnQuestionnaire']
        const isOnQuestionnairePage = route.path.includes("/questionnaires")
        const toShowId = toShow[0]
        const toShowCategoryId = toShowId.split(".")[0]
        const { key } = qCategories.find((qCategory)=> qCategory.id === toShowCategoryId )
        
        if(!isStaff && toShow.length && !isOnQuestionnairePage) {

            if(isWorkingOnQuestionnaire && !route.path.includes(key)) {
                redirect(`/questionnaires/${key}`)
            }

            return redirect("/questionnaires")
        }
    }

}