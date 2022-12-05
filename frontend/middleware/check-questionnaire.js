import { qCategories } from "~/utils/questionnaires"

export default function ({ store, route, redirect, app }) {
    const isStaff = store.getters['auth/isStaff']
    const {toShow} = store.getters['user/getQuestionnaire']
    const isOnQuestionnairePage = route.path.includes("/questionnaires")
    const hasValidToShow = toShow && Array.isArray(toShow)
    const locale = app.i18n.locale ?? 'pl'
    if(hasValidToShow && toShow.length) {
        const {isWorkingNow} = store.getters['user/getQuestionnaire']
        const isOnMainQuestionnairePage = isOnQuestionnairePage && route.path.split("/").length <= 2
        const toShowId = toShow[0]
        const toShowCategoryId = toShowId.split(".")[0]
        const { key } = qCategories.find((qCategory)=> qCategory.id === toShowCategoryId )
        
        if(!isStaff && toShow.length && !isOnQuestionnairePage) {
            return redirect(locale + "/questionnaires")
        } 
        else if(!isStaff && toShow.length && isOnQuestionnairePage) {
            if(isWorkingNow && (isOnMainQuestionnairePage || !route.path.includes(key))) { 
                redirect(`${locale}/questionnaires/${key}`)
            }
        }
    } else if(hasValidToShow && !toShow.length && isOnQuestionnairePage)  {
        return redirect(locale + "/projects")
    }

}