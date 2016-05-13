// TODO: test these as they are data related
export function findBy(params, collection, json) {
  const models = json[collection]
  if (!models) {
    return null
  }
  let found = null
  Object.keys(models).forEach((modelId) => {
    const model = models[modelId]
    Object.keys(params).forEach((propName) => {
      if (model[propName] !== params[propName]) {
        found = model
      }
    })
  })
  return found
}

export function findModel(json, initModel) {
  if (!initModel || !initModel.findObj || !initModel.collection) {
    return null
  }
  return findBy(initModel.findObj, initModel.collection, json)
}

export function getLinkObject(model, identifier, json) {
  if (!model || !model.links || !model.links[identifier]) { return null }
  const key = model.links[identifier].id || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  const deletedCollection = json[`deleted_${collection}`]
  if (key &&
      json[collection] &&
      json[collection][key] &&
      (!deletedCollection || deletedCollection.indexOf(key) === -1)) {
    return json[collection][key]
  }
  return null
}

export function getLinkArray(model, identifier, json) {
  if (!model || !model.links || !model.links[identifier]) { return null }
  const keys = model.links[identifier].ids || model.links[identifier]
  const collection = model.links[identifier].type || identifier
  const deletedCollection = json[`deleted_${collection}`]
  if (keys.length && json[collection]) {
    // filter they keys so that models that don't exist
    // aren't added to the link object mainly used for
    // when a model gets deleted ie: post or comment
    const filteredKeys = keys.filter((key) =>
      json[collection][key] && (!deletedCollection || deletedCollection.indexOf(key) === -1)
    )
    return filteredKeys.map((key) => json[collection][key])
  }
  return null
}

