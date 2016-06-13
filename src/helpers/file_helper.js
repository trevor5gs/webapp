export const SUPPORTED_IMAGE_TYPES = {
  BMP: 'image/bmp',
  GIF: 'image/gif',
  JPG: 'image/jpg',
  PNG: 'image/png',
  TIF: 'image/tif',
}

export function isValidFileType(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    let isValid = false
    let fileType = null
    fr.onloadend = (e) => {
      const arr = (new Uint8Array(e.target.result)).subarray(0, 4)
      let header = ''
      for (const value of arr) {
        header += value.toString(16)
      }
      if (/ffd8ff/i.test(header)) {
        isValid = true // image/jpg
        fileType = SUPPORTED_IMAGE_TYPES.JPG
      } else if (/424D/i.test(header)) {
        isValid = true // image/bmp
        fileType = SUPPORTED_IMAGE_TYPES.BMP
      } else if (/(4949|4d4d)/i.test(header)) {
        isValid = true // image/tiff
        fileType = SUPPORTED_IMAGE_TYPES.TIF
      } else {
        switch (header) {
          case '47494638': // image/gif
            isValid = true
            fileType = SUPPORTED_IMAGE_TYPES.GIF
            break
          case '89504e47': // image/png
            isValid = true
            fileType = SUPPORTED_IMAGE_TYPES.PNG
            break
          default:
            break
        }
      }
      resolve({ isValid, fileType })
    }
    fr.onerror = () => {
      reject({ ...fr.error })
    }
    fr.readAsArrayBuffer(file)
  })
}

