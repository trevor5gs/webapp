export function findBy(params, collection, json) {
  const models = json[collection]
  if (!models) {
    return null
  }
  for (const modelId in models) {
    const model = models[modelId]
    let found = true
    for (const propName in params) {
      if (model[propName] !== params[propName]) {
        found = false
        break
      }
    }
    if (found) {
      return model
    }
  }
  return null
}

export function getLinkObject(model, identifier, json) {
  if (!model.links[identifier]) { return null }
  const key = model.links[identifier].id || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  if (key && json[collection]) {
    return json[collection][key]
  }
}

export function getLinkArray(model, identifier, json) {
  if (!model.links[identifier]) { return null }
  const keys = model.links[identifier].ids || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  if (keys.length && json[collection]) {
    return keys.map((key) => {
      return json[collection][key]
    })
  }
}

