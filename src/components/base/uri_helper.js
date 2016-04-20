export function updateQueryParams(params) {
  // store current query in an object
  const search = document.location.search.replace('?', '')
  const queryObj = {}
  if (search.length) {
    const searchArr = search.split('&')
    for (const str of searchArr) {
      const keyValueArr = str.split('=')
      queryObj[keyValueArr[0]] = keyValueArr[1]
    }
  }
  // set/delete params
  for (const param in params) {
    if (params[param] !== null) {
      queryObj[param] = encodeURIComponent(params[param])
    } else {
      delete queryObj[param]
    }
  }
  // create query array
  const queryArr = []
  for (const key in queryObj) {
    if (queryObj[key] !== null) {
      queryArr.push(`${key}=${queryObj[key]}`)
    }
  }
  // re-assemble the query string
  let query = ''
  if (queryArr.length) {
    query = `?${queryArr.join('&')}`
  }
  return query
}

export function getQueryParamValue(param, uri) {
  const search = uri.split('?')[1]
  if (search) {
    const searchArr = search.split('&')
    for (const keyVal of searchArr) {
      const keyValArr = keyVal.split('=')
      if (keyValArr[0] === param) {
        return keyValArr[1]
      }
    }
  }
  return null
}

