/* eslint no-param-reassign: ["error", { props: false } ] */
import 'babel-polyfill'
import Pretender from 'fetch-pretender'

export function pretendServer(cb) {
  const server = new Pretender()

  if (cb) {
    cb(server)
  }

  server.prepareHeaders = (headers) => {
    headers['content-type'] = 'application/json; charset=utf-8'
    headers['Access-Control-Allow-Origin'] = 'http://localhost:9876'
    return headers
  }

  server.prepareBody = body => (body ? JSON.stringify(body) : null)

  server.get('/api/webapp-token', () => [
    200,
    {},
    {
      token: {
        access_token: 'abc123def',
      },
    },
  ])

  server.unhandledRequest = (verb, path, request) => {
    console.log('UNHANDLED REQUEST', verb, path, request) // eslint-disable-line no-console
    return [405]
  }
  return server
}
