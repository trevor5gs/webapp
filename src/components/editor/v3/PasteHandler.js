import { getLastWordPasted, replaceSelectionWithText } from '../SelectionUtil'
import { postPreviews, savePostImage } from '../../../actions/posts'

let dispatch = null

function checkForEmbeds(text) {
  for (const service of window.embetter.activeServices) {
    if (text.match(service.regex)) {
      const mediaUrl = service.link(text.match(service.regex)[1])
      dispatch(postPreviews(mediaUrl))
    }
  }
}

function handlePlainText(text) {
  if (!text.length) return
  replaceSelectionWithText(text)
  checkForEmbeds(text)
}

function handleAndroidBrokenPaste() {
  // android bug: https://code.google.com/p/chromium/issues/detail?id=369101
  requestAnimationFrame(() => {
    handlePlainText(getLastWordPasted())
  })
}

function handleClipboardItems(items) {
  for (const key in items) {
    if (items.hasOwnProperty(key)) {
      const item = items[key]
      if (item.type.indexOf('image') === 0) {
        dispatch(savePostImage(item.getAsFile()))
      }
    }
  }
}

function getBlobFromBase64(b64Data, contentType, sliceSize) {
  const type = contentType || ''
  const size = sliceSize || 512
  const byteCharacters = atob(b64Data)
  const byteArrays = []
  let offset = 0
  while (offset < byteCharacters.length) {
    const slice = byteCharacters.slice(offset, offset + size)
    const byteNumbers = new Array(slice.length)
    let i = 0
    while (i < slice.length) {
      byteNumbers[i] = slice.charCodeAt(i)
      i++
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
    offset += size
  }
  return new Blob(byteArrays, type)
}

function checkForImages(e) {
  const image = e.target.parentNode.querySelector('img')
  if (image) {
    // this works on FF paste of clipboard data
    if (image.src.match(/;base64,/)) {
      dispatch(savePostImage(getBlobFromBase64(image.src.split(',')[1], 'image/png')))
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

export function pasted(e, d) {
  dispatch = d
  if (window.$isAndroid) return handleAndroidBrokenPaste()
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

