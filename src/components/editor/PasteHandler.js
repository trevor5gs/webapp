import { isAndroid } from '../../vendor/jello'
import { getLastWordPasted, replaceSelectionWithText } from './SelectionUtil'
import { postPreviews, saveAsset } from '../../actions/editor'
import { getBlobFromBase64 } from '../../helpers/file_helper'

let dispatch = null
let editorId = null

function checkForEmbeds(text) {
  for (const service of window.embetter.activeServices) {
    if (text.match(service.regex)) {
      const mediaUrl = service.link(text.match(service.regex)[1])
      dispatch(postPreviews(mediaUrl, editorId, 0))
    }
  }
}

function handlePlainText(text) {
  if (!text.length) return
  if (text.match(/;base64,/)) {
    dispatch(saveAsset(
      getBlobFromBase64(text.split(',')[1], { type: 'image/png' }), editorId
    ))
  } else {
    replaceSelectionWithText(text)
    checkForEmbeds(text)
  }
}

function handleAndroidBrokenPaste() {
  // android bug: https://code.google.com/p/chromium/issues/detail?id=369101
  requestAnimationFrame(() => {
    handlePlainText(getLastWordPasted())
  })
}

function handleClipboardItems(items) {
  Object.keys(items).forEach((key) => {
    const item = items[key]
    if (item.type.indexOf('image') === 0) {
      dispatch(saveAsset(item.getAsFile(), editorId))
    }
  })
}

function checkForImages(e) {
  const image = e.target.parentNode.querySelector('img')
  if (image) {
    // this works on FF paste of clipboard data
    if (image.src.match(/;base64,/)) {
      dispatch(saveAsset(
        getBlobFromBase64(image.src.split(',')[1], { type: 'image/png' }), editorId
      ))
    } else if (image.src.indexOf('webkit-fake-url') === 0) {
      // safari adds 'webkit-fake-url://' to image src and throws security
      // violations when trying to access the data of the image
      handlePlainText('Sorry, but pasting images doesn\'t currently work in this browser. :ello:')
    } else if (image.src.indexOf('http') === 0) {
      // creates markdown of the image when right clicking on image to copy in FF
      handlePlainText(`![Pasted Image](${image.src})`)
    }
    e.target.parentNode.removeChild(image)
  }
}

export function pasted(e, d, id) {
  dispatch = d
  editorId = id
  if (isAndroid()) {
    handleAndroidBrokenPaste()
    return
  }
  const text = e.clipboardData.getData('text/plain')
  const items = e.clipboardData.items
  if (text.length) {
    e.preventDefault()
    handlePlainText(text)
  } else if (items) {
    handleClipboardItems(items)
  } else {
    setTimeout(() => {
      checkForImages(e)
    }, 1)
  }
}

export default pasted

