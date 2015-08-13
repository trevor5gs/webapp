import React from 'react'
import { Route, Redirect } from 'react-router'
import App from './containers/App'

export default (
  <Route name='app' component={App}>
    <Route path='onboarding'>
      <Route path='communities'
             getComponents={(cb) => getComponents(cb, 'communities')} />
      <Route path='awesome-people'
             getComponents={(cb) => getComponents(cb, 'awesome-people')} />
    </Route>
    <Redirect from='/' to='onboarding/communities' />
  </Route>
)

function getComponents(cb, path) {
  var requirements = []
  switch(path) {
    case 'communities':
      requirements.push('./containers/StreamView')
    case 'awesome-people':
      requirements.push('./containers/StreamView')
  }
  console.log(requirements)
  require.ensure([], (require) => {
    for(var index in requirements) {
      console.log( requirements[index] )
      cb(null, require(requirements[index]))
    }
  })
}
