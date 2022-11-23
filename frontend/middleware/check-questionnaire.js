import { qCategories } from "~/utils/questionnaires"

export default function ({ store, route, redirect }) {
    const isStaff = store.getters['auth/isStaff']
    const {toShow} = store.getters['user/getQuestionnaire']
    const hasValidToShow = toShow && Array.isArray(toShow)
    if(hasValidToShow && toShow.length) {
        const {isWorkingNow} = store.getters['user/getQuestionnaire']
        const isOnQuestionnairePage = route.path.includes("/questionnaires")
        const isOnMainQuestionnairePage = isOnQuestionnairePage && route.path.split("/").length <= 2
        const toShowId = toShow[0]
        const toShowCategoryId = toShowId.split(".")[0]
        const { key } = qCategories.find((qCategory)=> qCategory.id === toShowCategoryId )
        
        if(!isStaff && toShow.length && !isOnQuestionnairePage) {
            return redirect("/questionnaires")
        } else if(!isStaff && toShow.length && isOnQuestionnairePage) {

            if(isWorkingNow && isOnMainQuestionnairePage) {
                redirect(`/questionnaires/${key}`)
            }

            if(isWorkingNow && !route.path.includes(key)) {
                redirect(`/questionnaires/${key}`)
            }
        }
    } else if(hasValidToShow && !toShow.length && route.path.includes("/questionnaires"))  {
        return redirect("/projects")
    }

}