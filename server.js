/*eslint-disable */
var path = require('path')
var express = require('express')
var app = express()

app.use('/hello', function(req, res) {
  res.send("yo")
})

app.use(express.static('public'))
app.use(express.static('public/assets'))

app.use('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})
var port = process.env.PORT || 6660;
app.listen(6660, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:'+port)
})
