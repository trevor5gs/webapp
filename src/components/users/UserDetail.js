import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import { loadUserDetail } from '../../actions/profile'
import * as MAPPING_TYPES from '../../constants/mapping_types'

class UserDetail extends React.Component {
  render() {
    const { params } = this.props
    return (
      <div className="UserDetail Panel">
        <StreamComponent
          action={loadUserDetail(params.username)}
          initModel={{ collection: MAPPING_TYPES.POSTS, findObj: { token: params.username } }} />
      </div>
    )
  }
}

UserDetail.propTypes = {
  params: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
  }).isRequired,
}

export default UserDetail

