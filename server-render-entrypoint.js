import kue from 'kue'
import cluster from 'cluster'
import os from 'os'
import librato from 'librato-node'
import { updateStrings as updateTimeAgoStrings } from './src/lib/time_ago_in_words'
import handlePrerender from './src/prerender'

updateTimeAgoStrings({ about: '' })

// Fire up queue worker
const queue = kue.createQueue({ redis: process.env[process.env.REDIS_PROVIDER] })
const clusterWorkerSize = os.cpus().length

// Periodically clear stuck jobs
queue.watchStuckJobs()

// Report Kue stats to Librato
librato.configure({ email: process.env.LIBRATO_EMAIL, token: process.env.LIBRATO_TOKEN })
librato.start()
librato.on('error', (err) => {
  console.error(err);
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
  console.log('An error occurred in Kue: ', err)
})

if (cluster.isMaster) {
  console.log(`Forking off ${clusterWorkerSize} worker processes`)
  for (let i = 0; i < clusterWorkerSize; i += 1) {
    cluster.fork()
  }
} else {
  queue.process('render', 1, (job, done) => {
    handlePrerender(job.data, done)
  })
}

process.once('SIGTERM', () => {
  clearInterval(libratoReporter)
  librato.stop()
  queue.shutdown(5000, (err) => {
    console.log('Kue shutting down: ', err)
    process.exit(0)
  })
})
process.once('uncaughtException', (err) => {
  console.error('Something bad happened: ', err)
  queue.shutdown(1000, (err2) => {
    console.error('Kue shutdown result: ', err2 || 'OK')
    process.exit(1)
  })
})
