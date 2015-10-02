export function getLinkObject(model, identifier, json) {
  if (!model.links[identifier]) { return null }
  const key = model.links[identifier].id || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  if (key && json[collection]) {
    return json[collection][key]
  }
}

export function getLinkArray(model, identifier, json) {
  const keys = model.links[identifier].ids || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  if (keys.length && json[collection]) {
    return keys.map((key) => {
      return json[collection][key]
    })
  }
}

