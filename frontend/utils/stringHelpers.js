export function capitalize(string) {
  if (string.length === 0) return ""

  return (string[0].toUpperCase() + string.slice(1))
}

export function snakeToCamel(string){
  const [start, ...rest] = string.split("_")

  return (start + rest.map(capitalize).join(""))
}

export function objectKeysSnakeToCamel(object) {
  return Object
    .entries(object)
    .reduce((result, [key, value]) => ({
      ...result,
      [snakeToCamel(key)]: value
    }), {})
}

