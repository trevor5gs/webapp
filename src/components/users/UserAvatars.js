import React, { Component, PropTypes } from 'react'
import { loadUserAvatars } from '../../actions/user'
import StreamComponent from '../streams/StreamComponent'

class UserAvatars extends Component {

  static propTypes = {
    endpoint: PropTypes.object.isRequired,
    icon: PropTypes.element.isRequired,
    post: PropTypes.object.isRequired,
    resultType: PropTypes.string.isRequired,
  }

  render() {
    const { endpoint, icon, post, resultType } = this.props
    return (
      <section className="UserAvatars">
        {icon}
        <StreamComponent
          ref="streamComponent"
          action={loadUserAvatars(endpoint, post, resultType)}
          paginatorText="+more"
          ignoresScrollPosition
        />
      </section>
    )
  }
}

export default UserAvatars

