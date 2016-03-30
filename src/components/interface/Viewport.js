export const hideSoftKeyboard = () => {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

