import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import { loadUserDetail } from '../../actions/user'
import * as MAPPING_TYPES from '../../constants/mapping_types'

class UserDetailView extends React.Component {
  render() {
    const { params } = this.props
    return (
      <section className="UserDetailView Panel">
        <StreamComponent
          ref="streamComponent"
          action={loadUserDetail(`~${params.username}`)}
          initModel={{ collection: MAPPING_TYPES.USERS, findObj: { username: params.username } }} />
      </section>
    )
  }
}

UserDetailView.propTypes = {
  params: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
  }).isRequired,
}

export default UserDetailView

