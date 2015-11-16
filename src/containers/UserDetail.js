import React from 'react'
import App from './App'
import StreamComponent from '../components/streams/StreamComponent'
import { loadUserDetail } from '../actions/user'
import * as MAPPING_TYPES from '../constants/mapping_types'

class UserDetail extends React.Component {
  render() {
    const { params } = this.props
    return (
      <App>
        <section className="UserDetail Panel">
          <StreamComponent
            ref="streamComponent"
            action={loadUserDetail(`~${params.username}`)}
            initModel={{ collection: MAPPING_TYPES.USERS, findObj: { username: params.username } }} />
        </section>
      </App>
    )
  }
}

UserDetail.propTypes = {
  params: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
  }).isRequired,
}

UserDetail.preRender = (store, routerState) => {
  return store.dispatch(loadUserDetail(`~${routerState.params.username}`))
}

export default UserDetail

