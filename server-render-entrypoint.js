import 'babel-polyfill'
import 'isomorphic-fetch'
import Immutable from 'immutable'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { renderStaticOptimized } from 'glamor-server'
import React from 'react'
import Helmet from 'react-helmet'
import Honeybadger from 'honeybadger'
import kue from 'kue'
import cluster from 'cluster'
import os from 'os'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { updateStrings as updateTimeAgoStrings } from './src/lib/time_ago_in_words'
import { createElloStore } from './src/store'
import createRoutes from './src/routes'
import { serverRoot } from './src/sagas'

const indexStr = fs.readFileSync(path.join(__dirname, './public/index.html'), 'utf-8')

// Return promises for initial loads
function preRender(renderProps, store, sagaTask) {
  const promises = renderProps.components.map(component => ((component && component.preRender) ? component.preRender(store, renderProps) : null)).filter(component => !!component)
  return Promise.all(promises).then(() => {
    store.close()
    return sagaTask.done
  })
}

const createSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS
  return (state) => {
    const routingState = state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

function handlePrerender(context, done) {
  const { access_token, originalUrl, url } = context

  console.log(`Rendering ${url} isomorphically`)

  const memoryHistory = createMemoryHistory(originalUrl)
  const store = createElloStore(memoryHistory, {
    authentication: Immutable.Map({
      accessToken: access_token,
      isLoggedIn: false,
    }),
  })
  const isServer = true
  const routes = createRoutes(store, isServer)
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: createSelectLocationState(),
  })
  const sagaTask = store.runSaga(serverRoot)

  match({ history, routes, location: url }, (error, redirectLocation, renderProps) => {
    // populate the router store object for initial render
    if (error) {
      console.log('ELLO MATCH ERROR', error)
    } else if (redirectLocation) {
      console.log('ELLO HANDLE REDIRECT', redirectLocation)
      done(null, { type: 'redirect', location: redirectLocation.pathname })
    } else if (!renderProps) {
      console.log('NO RENDER PROPS')
      done(null)
      return
    }

    const InitialComponent = (
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    )

    preRender(renderProps, store, sagaTask).then(() => {
      const componentHTML = renderToString(InitialComponent)
      const head = Helmet.rewind()
      const { css, ids } = renderStaticOptimized(() => componentHTML)
      const state = store.getState()
      if (state.stream.get('should404') === true) {
        done(null, { type: '404' })
      } else {
        Object.keys(state).forEach((key) => {
          state[key] = state[key].toJS()
        })
        const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
        const initialGlamTag = `<script id="glam-state">window.__GLAM__ = ${JSON.stringify(ids)}</script>`
        // Add helmet's stuff after the last statically rendered meta tag
        const html = indexStr.replace(
          'rel="copyright">',
          `rel="copyright">${head.title.toString()} ${head.meta.toString()} ${head.link.toString()} <style>${css}</style>`,
        ).replace('<div id="root"></div>', `<div id="root">${componentHTML}</div>${initialStateTag} ${initialGlamTag}`)
        done(null, { type: 'render', body: html })
      }
    }).catch((err) => {
      // this will give you a js error like:
      // `window is not defined`
      console.log('ELLO CATCH ERROR', err)
      Honeybadger.notify(err);
      done(null, { type: 'error' })
    })
    renderToString(InitialComponent)
  })
}

// Fire up queue worker
const queue = kue.createQueue(redis: process.env[process.env.REDIS_PROVIDER])
const clusterWorkerSize = os.cpus().length

queue.on( 'error', function( err ) {
  console.log('An error occurred in Kue: ', err)
});

if (cluster.isMaster) {
  console.log(`Forking off ${clusterWorkerSize} worker processes`)
  for (var i = 0; i < clusterWorkerSize; i++) {
    cluster.fork()
  }
} else {
  queue.process('render', 1, (job, done) => {
    handlePrerender(job.data, done)
  })
}

process.once('SIGTERM', (sig) => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutting down: ', err)
    process.exit(0)
  })
})

export default handlePrerender
