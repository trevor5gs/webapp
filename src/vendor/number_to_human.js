const billion = 1000000000.0
const million = 1000000.0
const thousand = 1000.0

export function numberToHuman(number, showZero = true) {
  if (number === 0 && !showZero) { return '' }
  let num
  let suffix
  if (number >= billion) {
    num = Math.round((number / billion) * 100.0) / 100.0
    suffix = 'B'
  } else if (number >= million) {
    num = Math.round((number / million) * 100.0) / 100.0
    suffix = 'M'
  } else if (number >= thousand) {
    num = Math.round((number / thousand) * 100.0) / 100.0
    suffix = 'K'
  } else {
    num = Math.round(number * 100.0) / 100.0
    suffix = ''
  }
  let strNum = `${num}`
  const strArr = strNum.split('.')
  if (strArr[strArr.length - 1] === '0') {
    strNum = strArr[0]
  }
  return `${strNum}${suffix}`
}

export default numberToHuman

