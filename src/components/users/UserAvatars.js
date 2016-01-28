import React, { Component, PropTypes } from 'react'
import { loadUserAvatars } from '../../actions/user'
import StreamComponent from '../streams/StreamComponent'

class UserAvatars extends Component {

  static propTypes = {
    endpoint: PropTypes.object.isRequired,
    icon: PropTypes.element.isRequired,
    resultKey: PropTypes.string.isRequired,
  };

  render() {
    const { endpoint, icon, resultKey } = this.props
    return (
      <section className="UserAvatars">
        {icon}
        <StreamComponent
          ref="streamComponent"
          action={loadUserAvatars(endpoint, resultKey)}
        />
      </section>
    )
  }
}

export default UserAvatars

