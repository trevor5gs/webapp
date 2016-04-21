import app from './src/server-iso'
import { fetchOauthToken } from './oauth'

const port = process.env.PORT || 6660
const workers = process.env.WEB_CONCURRENCY || 1;
const backlog = process.env.BACKLOG || 511

const start = (workerId) => {
  const server = app.listen(port, backlog, (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Worker ' + workerId + ' listening at http://localhost:' + port)
  })

  process.on('SIGINT', () => {
    console.log('Caught SIGINT, exiting...')
    setTimeout(() => {
      console.log('Server did not drain connections within 5 seconds. Forcing shutdown...')
      process.exit(0)
    }, 5000)
    server.close(() => {
      process.exit(0)
    })
  })
}

// Kick off token fetch
fetchOauthToken(() => {
  start(1)
})
