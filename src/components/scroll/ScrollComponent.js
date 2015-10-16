const scrollObjects = []
let ticking = false

function callMethod(method) {
  for (const obj of scrollObjects) {
    if (obj[method]) {
      obj[method]()
    }
  }
}

function getScrollY() {
  return Math.ceil(window.pageYOffset)
}

function getScrollHeight() {
  return Math.max(document.body.scrollHeight, document.body.offsetHeight)
}

function getScrollBottom() {
  return Math.round(getScrollHeight() - window.innerHeight)
}

function checkScrollPosition() {
  const scrollY = getScrollY()
  const scrollBottom = getScrollBottom()
  if (scrollY === 0) {
    callMethod('onScrollTop')
  } else if (Math.abs(scrollY - scrollBottom) < 5) {
    callMethod('onScrollBottom')
  }
}

function windowWasScrolled() {
  if (!ticking) {
    requestAnimationFrame(() => {
      checkScrollPosition()
      ticking = false
    })
    ticking = true
  }
}

export function addScrollObject(obj) {
  if (scrollObjects.indexOf(obj) === -1) {
    scrollObjects.push(obj)
  }
  if (scrollObjects.length === 1) {
    window.addEventListener('scroll', windowWasScrolled)
  }
}

export function removeScrollObject(obj) {
  const index = scrollObjects.indexOf(obj)
  if (index > -1) {
    scrollObjects.splice(index, 1)
  }
  if (scrollObjects.length === 0) {
    window.removeEventListener('scroll', windowWasScrolled)
  }
}
