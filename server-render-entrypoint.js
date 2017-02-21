import kue from 'kue'
import cluster from 'cluster'
import os from 'os'
import { updateStrings as updateTimeAgoStrings } from './src/lib/time_ago_in_words'
import handlePrerender from './src/prerender'

// Fire up queue worker
const queue = kue.createQueue({ redis: process.env[process.env.REDIS_PROVIDER] })
const clusterWorkerSize = os.cpus().length

updateTimeAgoStrings({ about: '' })

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
  queue.shutdown(5000, (err) => {
    console.log('Kue shutting down: ', err)
    process.exit(0)
  })
})
