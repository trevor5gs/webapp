let isListening = false

/* eslint-disable no-param-reassign */
const setDragData = (e, data) => {
  e.dataTransfer.setData('application/json', JSON.stringify(data))
  e.dataTransfer.dropEffect = 'move'
}
/* eslint-enable no-param-reassign */

const onDragStart = (e) => {
  const target = e.target
  const classList = target.classList
  const nodeName = target.nodeName.toLowerCase()

  // @mention (from the pipeline)
  const mention = classList.contains('user-mention') ? target : null
  if (mention) {
    setDragData(e, { username: mention.innerHTML.substring(1) })
    return
  }

  // Emojis!
  const emoji = classList.contains('emoji') ? target : null
  if (emoji) {
    setDragData(e, { emojiCode: emoji.getAttribute('title') })
    return
  }

  // Ello logo
  const mark = classList.contains('NavbarMark') ? target : null
  if (mark) {
    setDragData(e, { username: 'ello' })
    return
  }

  // Images
  const image = nodeName === 'img' ? target : null
  if (image) {
    setDragData(e, { imgSrc: image.getAttribute('src') })
    return
  }

  // Links
  const link = nodeName === 'a' ? target : null
  if (link && link.getAttribute('href').indexOf('http') !== -1) {
    setDragData(e, { href: link.getAttribute('href'), linkText: link.innerHTML })
    return
  }

  // Cancel drag unless we found something we want to drag
  e.preventDefault()
  e.stopPropagation()
}

const onDragEnd = () => {
  // console.log('onDragEnd', e.target)
}

export function addGlobalDrag() {
  if (isListening || !document || !document.body) { return }
  document.body.addEventListener('dragstart', onDragStart)
  document.body.addEventListener('dragend', onDragEnd)
  isListening = true
}

export function removeGlobalDrag() {
  if (!isListening || !document || !document.body) { return }
  document.body.removeEventListener('dragstart', onDragStart)
  document.body.removeEventListener('dragend', onDragEnd)
  isListening = false
}

