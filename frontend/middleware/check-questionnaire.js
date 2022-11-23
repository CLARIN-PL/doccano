import { qCategories } from "~/utils/questionnaires"

export default function ({ store, route, redirect }) {
    // const isStaff = store.getters['auth/isStaff']
    const isStaff = false
    const {toShow} = store.getters['user/getQuestionnaire']
    if(toShow && Array.isArray(toShow) && toShow.length) {
        const {isWorkingNow} = store.getters['user/getQuestionnaire']
        const isOnQuestionnairePage = route.path.includes("/questionnaires")
        const toShowId = toShow[0]
        const toShowCategoryId = toShowId.split(".")[0]
        const { key } = qCategories.find((qCategory)=> qCategory.id === toShowCategoryId )
        
        if(!isStaff && toShow.length && !isOnQuestionnairePage) {

            if(isWorkingNow && !route.path.includes(key)) {
                redirect(`/questionnaires/${key}`)
            }

            return redirect("/questionnaires")
        }
    } else if(toShow && !toShow.length && route.path.includes("/questionnaires"))  {
        return redirect("/projects")
    }

}