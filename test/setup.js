import fs from 'fs'
import path from 'path'
import jsdom from 'jsdom'
import dotenv from 'dotenv'

dotenv.load()

const exposedProperties = ['window', 'navigator', 'document'];
const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8')

global.document = jsdom.jsdom(html)
global.window = document.defaultView

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = { userAgent: 'node.js' }
global.URL = { createObjectURL: (input) => input }
global.ENV = JSON.stringify(require('../env'))

