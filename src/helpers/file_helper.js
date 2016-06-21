import EXIF from 'exif-js'
// import exifOrient from 'exif-orient'

export const SUPPORTED_IMAGE_TYPES = {
  BMP: 'image/bmp',
  GIF: 'image/gif',
  JPG: 'image/jpg',
  PNG: 'image/png',
}

export function isValidFileType(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    let isValid = false
    let fileType = null
    let exifData = null
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
      if (fileType !== SUPPORTED_IMAGE_TYPES.GIF) {
        exifData = EXIF.readFromBinaryFile(e.target.result)
      }
      resolve({ isValid, fileType, exifData })
    }
    fr.onerror = () => {
      reject({ ...fr.error })
    }
    fr.readAsArrayBuffer(file)
  })
}

export function orientImage() {
  // should return capped width/height and transform value
}


export function renderToCanvas() {
  // should return a canvas
}

export function convertBlobToBase64Image({ blob, exifData, maxWidth = 2560, maxHeight = 1440 }) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = null
    const src = null
    img.onload = () => {
      const orientation = exifData.Orientation
      console.log(orientation, maxWidth, maxHeight)
      // if it needs it?
      orientImage()
      // renderToCanvas(stuff)
      resolve({ canvas, src })
    }
    img.onerror = () => {
      reject({ ...img.error })
    }
    img.src = blob
  })
}


// export function orientImage(img, orientation, fn) {
//   exifOrient(img, orientation, (err, canvas) => {
//     const src = canvas.toDataURL(SUPPORTED_IMAGE_TYPES.JPG)
//     fn({ canvas, src })
//   })
// }

// Kill this before we are done.
// export function orientImage(img, fn) {
//   EXIF.getData(img, () => {
//     const orientation = img.exifdata.Orientation
//     if (orientation === 3 || orientation === 6 || orientation === 8 && fn) {
//       exifOrient(img, orientation, (err, canvas) => {
//         const src = canvas.toDataURL(SUPPORTED_IMAGE_TYPES.JPG)
//         fn({ canvas, img, orientation, src })
//       })
//     }
//   })
// }

