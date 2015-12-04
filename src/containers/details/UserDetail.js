import React from 'react'
import Helmet from 'react-helmet'
import StreamComponent from '../../components/streams/StreamComponent'
import { loadUserDetail } from '../../actions/user'
import * as MAPPING_TYPES from '../../constants/mapping_types'

class UserDetail extends React.Component {
  render() {
    const { params } = this.props
    return (
      <section className="UserDetail Panel">
        <Helmet title={`${params.username}`} />
        <StreamComponent
          ref="streamComponent"
          action={loadUserDetail(`~${params.username}`)}
          initModel={{ collection: MAPPING_TYPES.USERS, findObj: { username: params.username } }} />
      </section>
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

