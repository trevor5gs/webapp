import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import { loadUserAvatars } from '../../actions/user'

class UserAvatars extends React.Component {
  render() {
    const { endpoint, icon, resultKey } = this.props
    return (
      <section className="UserAvatars">
        {icon}
        <StreamComponent
          ref="streamComponent"
          action={loadUserAvatars(endpoint, resultKey)} />
      </section>
    )
  }
}

UserAvatars.propTypes = {
  endpoint: React.PropTypes.object.isRequired,
  icon: React.PropTypes.element.isRequired,
  resultKey: React.PropTypes.string.isRequired,
}

export default UserAvatars

