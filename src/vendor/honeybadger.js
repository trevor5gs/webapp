/* eslint-disable import/no-mutable-exports */
/* eslint-disable global-require */
// this is only needed as a guard for server rendering
// and testing not having access to document. you shouldn't
// need to change anything in the components that
// use honeybadger since `componentDidMount` doesn't
// get called when rendering on the server/testing
let Honeybadger = null
if (typeof document !== 'undefined') {
  Honeybadger = require('honeybadger-js')
}

export default Honeybadger

