/*eslint-disable */
var path = require('path')
var express = require('express')
var app = express()

app.use(express.static('public'))
app.use(express.static('public/assets'))

// TODO We may be able to remove this with better webpack build for prod
app.use('/__webpack_hmr', function(req, res){
  //noop
})

app.use('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(6660, 'localhost', function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:6660')
})
