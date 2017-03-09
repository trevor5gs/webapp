import { updateStrings as updateTimeAgoStrings } from './src/lib/time_ago_in_words'
import prerender from './src/prerender'

// This is a wrapper to handle a single isomorphic render inside a child process


function startRender(context) {
  prerender(context, (error, result) =>  {
    // error indicates an abnormal result
    if (error) {
      process.exit(1)
    // anything else, we send, wait for the send to finish, and exit
    } else {
      process.send(result, null, {}, () => {
        process.exit(0)
      })
    }
  })
}

process.on('message', startRender)

