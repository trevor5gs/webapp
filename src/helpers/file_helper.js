import EXIF from 'exif-js'

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

export function getRestrictedSize(width, height, maxWidth, maxHeight) {
  let wv = width
  let hv = height

  if (width / maxWidth > height / maxHeight) {
    if (width > maxWidth) {
      hv *= maxWidth / width
      wv = maxWidth
    }
  } else {
    if (height > maxHeight) {
      wv *= maxHeight / height
      hv = maxHeight
    }
  }
  return { width: wv, height: hv }
}

// Orientation functions based on:
// https://github.com/buunguyen/exif-orient

function rotate(canvas, ctx, deg) {
  const width = canvas.width
  const height = canvas.height
  ctx.translate(width / 2, height / 2)
  ctx.rotate(deg * (Math.PI / 180))
  ctx.translate(-width / 2, -height / 2)
  if (Math.abs(deg) === 90) {
    ctx.translate((width - height) / 2, -(width - height) / 2)
  }
}

function flip(canvas, ctx, flipX, flipY) {
  ctx.translate(flipX ? canvas.width : 0, flipY ? canvas.height : 0)
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)
}

export function orientImage(img, orientation = 1, wv, hv) {
  // source: http://sylvana.net/jpegcrop/exif_orientation.html
  // orientation mapped as [1, 2, 3, 4, 5, 6, 7, 8]
  // [flip-x, flip-y, deg]
  const transforms = [
    [false, false, 0],
    [true, false, 0],
    [false, false, 180],
    [false, true, 0],
    [true, false, 90],
    [false, false, 90],
    [true, false, -90],
    [false, false, -90],
  ]
  const transform = transforms[orientation - 1]
  const flipX = transform[0]
  const flipY = transform[1]
  const deg = transform[2]

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width = wv || img.naturalWidth
  const height = hv || img.naturalHeight

  canvas.width = Math.abs(deg) === 90 ? height : width
  canvas.height = Math.abs(deg) === 90 ? width : height

  if (flipX || flipY) {
    flip(canvas, ctx, flipX, flipY)
  }

  if (deg) {
    rotate(canvas, ctx, deg)
  }
  ctx.drawImage(img, 0, 0)
  return canvas
}

export function processImage({ exifData, file, fileType, maxWidth = 2560, maxHeight = 1440 }) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = getRestrictedSize(img.width, img.height, maxWidth, maxHeight)
      const orientation = exifData.Orientation
      const canvas = orientImage(img, orientation, width, height)
      const src = canvas.toDataURL(fileType || SUPPORTED_IMAGE_TYPES.JPG)
      resolve({ canvas, src })
    }
    img.onerror = () => {
      reject({ canvas: null, src: file })
    }
    img.src = file
  })
}

