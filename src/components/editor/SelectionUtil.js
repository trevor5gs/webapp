
// getWordFromSelection: ->
//   selection = document.getSelection()
//   return unless @node = selection.anchorNode
//   return '' unless @node.nodeName == '#text'
//   text = @node.textContent
//   text = ' ' unless text && text.length
//   wordArr = text.split('')
//   @endIndex = selection.anchorOffset - 1
//   @endIndex = 0 if @endIndex < 0
//   letters = []
//   for index in [@endIndex..0]
//     letter = wordArr[index]
//     prevLetter = if index > 0 then wordArr[index - 1] else null
//     break unless letter
//     if letter.match(/\s/)
//       break
//     else if letter.match(/:/) && (!prevLetter || prevLetter.match(/(\s|:)+/))
//       letters.unshift(letter)
//       break
//     else letters.unshift(letter)
//   @startIndex = @endIndex - letters.length + 1
//   letters.join('')


// getPositionFromSelection: ->
//   @getWordFromSelection()
//   range = document.createRange()
//   range.setStart(@node, @startIndex)
//   range.setEnd(@node, @endIndex + 1)
//   pos = range.getBoundingClientRect()
//   range.detach()
//   {
//     top: pos.top
//     left: pos.left + @getFirefoxOffset()
//     height: pos.height
//     width: pos.width
//   }


// getPositionOfCaret: ->
//   selection = document.getSelection()
//   return unless node = selection.anchorNode
//   return unless selection.type = "Caret"
//   range = selection.getRangeAt(0)
//   if range.getClientRects().length
//     pos = range.getClientRects()[0]
//     {
//       top: pos.top
//       left: pos.left + @getFirefoxOffset()
//       height: pos.height
//       width: pos.width
//     }
//   else
//     # newline doesn't give us a good clientRect
//     return null


// replaceWordFromSelection: (word) ->
//   @getWordFromSelection()
//   range = document.createRange()
//   return unless @node.nodeName == '#text'
//   range.setStart(@node, @startIndex)
//   range.setEnd(@node, @endIndex + 1)
//   node = document.createTextNode(word)
//   range.deleteContents()
//   range.insertNode(node)
//   range.setEndAfter(node)
//   selection = document.getSelection()
//   selection.addRange(range)
//   selection.collapseToEnd()
//   # this is a fix for safari not placing the cursor at the end of the initial text node..
//   if document.activeElement.textContent.split(' ').length == 1
//     @placeCursorAtEndOfContent(document.activeElement)
//   range.detach()


export function replaceSelectionWithText(text) {
  const selection = document.getSelection()
  const node = document.createTextNode(text)
  let range = null
  if (selection.type === 'Range') {
    range = selection.getRangeAt(0)
    range.deleteContents()
  } else {
    range = document.createRange()
    range.setStart(selection.anchorNode, selection.anchorOffset)
  }
  range.insertNode(node)
  range.selectNodeContents(node)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}


// placeCursorAtEndOfContent: (editable) ->
//   range = document.createRange()
//   range.selectNodeContents(editable)
//   range.collapse(false)
//   sel = document.getSelection()
//   sel.removeAllRanges()
//   sel.addRange(range)


// # perhaps better than above method, which seems to fail sometimes
// placeCaretAtEnd: (el) ->
//   el.focus()
//   if typeof window.getSelection isnt "undefined" and typeof document.createRange isnt "undefined"
//     range = document.createRange()
//     range.selectNodeContents(el)
//     range.collapse(false)
//     sel = window.getSelection()
//     sel.removeAllRanges()
//     sel.addRange(range)
//   else unless typeof document.body.createTextRange is "undefined"
//     textRange = document.body.createTextRange()
//     textRange.moveToElementText(el)
//     textRange.collapse(false)
//     textRange.select()
//   return


export function getLastWordPasted() {
  const selection = document.getSelection()
  const node = selection.anchorNode
  const text = node && node.textContent ? node.textContent : ''
  if (!node || !text) return ''
  const nodeWords = text.split(' ')
  return nodeWords[nodeWords.length - 1]
}


// getFirefoxOffset: ->
//   return 0 unless document.documentElement.classList.contains('is-firefox')
//   return 0 if document.body.classList.contains('omnibar--open')
//   return 0 if @getBrowserAndVersion().version > 33
//   return document.getElementById('toolbar').offsetWidth


// getBrowserAndVersion: ->
//   ua = navigator.userAgent
//   M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) or []
//   if /trident/i.test(M[1])
//     tem = /\brv[ :]+(\d+)/g.exec(ua) or []
//     return browser: 'IE', version: parseFloat(tem[1] || '')
//   if M[1] == 'Chrome'
//     tem = ua.match(/\bOPR\/(\d+)/)
//     return browser: 'Opera', version: parseFloat(tem[1]) if tem?
//   if M[2]
//     M = [ M[1], M[2] ]
//   else
//     M = [ navigator.appName, navigator.appVersion, '-?']
//   M.splice 1, 1, tem[1]  if (tem = ua.match(/version\/(\d+)/i))?
//   return browser: M[0], version: parseFloat(M[1])

