import kue from 'kue'
import cluster from 'cluster'
import librato from 'librato-node'
import { updateStrings as updateTimeAgoStrings } from './src/lib/time_ago_in_words'
import cp from 'child_process'

updateTimeAgoStrings({ about: '' })

// Fire up queue worker
const queue = kue.createQueue({ redis: process.env[process.env.REDIS_PROVIDER] })
const clusterWorkerSize = parseInt(process.env.CLUSTER_WORKERS, 10) || 1
const simultaneousWorkerRenders = parseInt(process.env.SIMULTANEOUS_RENDERS, 10) || 1
const renderProcessTimeout = parseInt(process.env.RENDER_PROCESS_TIMEOUT, 10) || 60

// Periodically clear stuck jobs
queue.watchStuckJobs()

// Report Kue stats to Librato
librato.configure({ email: process.env.LIBRATO_EMAIL, token: process.env.LIBRATO_TOKEN })
librato.start()
librato.on('error', (err) => {
  Honeybadger.notify(err)
  console.error(err)
})

const libratoReporter = setInterval(() => {
  queue.inactiveCount((err, total) => {
    if (!err) {
      librato.measure('kue.inactive.count', total, { source: 'webapp' })
    }
  })
  queue.activeCount((err, total) => {
    if (!err) {
      librato.measure('kue.active.count', total, { source: 'webapp' })
    }
  })
  queue.failedCount((err, total) => {
    if (!err) {
      librato.measure('kue.failed.count', total, { source: 'webapp' })
    }
  })
  queue.completeCount((err, total) => {
    if (!err) {
      librato.measure('kue.complete.count', total, { source: 'webapp' })
    }
  })
}, 30 * 1000);

queue.on('error', (err) => {
  Honeybadger.notify(err)
  console.log('An error occurred in Kue: ', err)
})

if (cluster.isMaster) {
  console.log(`Forking off ${clusterWorkerSize} worker processes`)
  for (let i = 0; i < clusterWorkerSize; i += 1) {
    cluster.fork()
  }
} else {
  queue.process('render', simultaneousWorkerRenders, (job, done) => {
    let child = null

    // Set up a failsafe timeout to kill stuck child processes
    const renderTimeout = setTimeout(() => {
      console.log(`Render timed out after ${renderProcessTimeout}s; killing child process.`)
      librato.increment('webapp-render-child-timeout')
      if (child) {
        child.kill('SIGKILL')
      }
      done(null)
    }, renderProcessTimeout * 1000)

    // Fork the render process (but don't start the render just yet)
    child = cp.fork('./dist/server-render-entrypoint')

    // Handle a successful render completion
    child.once('message', (msg) => {
      done(null, msg)
      clearTimeout(renderTimeout)
    })

    // Ensure any lingering renderer processes are cleaned up at shutdown
    const exitHandler = () => {
      console.log(`Killing child render process ${child.pid}`)
      child.kill('SIGKILL')
    }
    process.on('exit', exitHandler);

    // Handle any other child process cleanup
    child.once('exit', (code, signal) => {
      // These should occur for any exit (normal or abnormal)
      clearTimeout(renderTimeout)
      process.removeListener('exit', exitHandler);

      // Abnormal exit, may be in a dirty state
      if (code !== 0) {
        console.log(`Child render process exited with ${code} due to ${signal}`)
        done()
      }
    })

    // Now, actually kick off the render!
    child.send(job.data)
  })
}

process.once('SIGTERM', () => {
  clearInterval(libratoReporter)
  librato.stop()
  queue.shutdown(5000, (err) => {
    console.log('Kue shutting down: ', err || 'OK')
    process.exit(0)
  })
})
process.once('uncaughtException', (err) => {
  Honeybadger.notify(err)
  console.error('Something bad happened: ', err)
  queue.shutdown(1000, (err2) => {
    console.error('Kue shutdown result: ', err2 || 'OK')
    process.exit(1)
  })
})
