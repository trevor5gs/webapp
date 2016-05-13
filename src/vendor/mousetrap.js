/* eslint-disable import/no-mutable-exports */
/* eslint-disable global-require */
// this is only needed as a guard for server rendering
// and not having access to window. you shouldn't
// need to change anything in the components that
// use mousetrap since `componentDidMount` doesn't
// get called when rendering on the server
let Mousetrap = null
if (typeof window !== 'undefined') {
  Mousetrap = require('mousetrap')
}

export default Mousetrap

