import 'newrelic'

const path = require('path')
const express = require('express')
const app = express()

app.use(express.static('public'))
app.use('/static', express.static('public/static'))

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})
const port = process.env.PORT || 6660
app.listen(port, (err) => {
  if (err) {
    console.log('Listen error', err)
    return
  }
  console.log('Listening at http://localhost:' + port)
})
