import _ from "lodash"
import { qCategories } from "~/utils/questionnaires"

export default function ({ store, route }) {
    const isStaff = store.getters['auth/isStaff']
    const {toShow} = store.getters['user/getQuestionnaire']
    const qTypes = _.flatMap(qCategories, "types")
    if(!isStaff && toShow.length) {
        const toShowId = toShow[0]
        const toShowType = qTypes.find((qType)=> qType.id === toShowId)
        const isInMiddleOfQuestionnaire = toShowType && route.path.includes(toShowType.key)

        if(!isInMiddleOfQuestionnaire) {
            return redirect("/questionnaires")
        }
    }
}