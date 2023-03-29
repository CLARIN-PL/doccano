export function addGroupToDimensionList(dimensions) {
    if (!Array.isArray(dimensions)) {
        return []
    }
    return dimensions.map((item) => {
        const groupMap = {
          DIM_OTH: 'Others',
          DIM_OF: 'Offensive',
          DIM_HUM: 'Humor',
          DIM_EMO: 'Emotions'
        }
        if (item.metadata && item.metadata.length) {
          const { codename } = item.metadata[0]
          const groupMapKey =
            Object.keys(groupMap).find((key) => codename.includes(key)) || ''
          item.group = groupMap[groupMapKey] || 'Dynamic'
        }
        return item
      })
}