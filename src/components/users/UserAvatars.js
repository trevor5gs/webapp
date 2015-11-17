import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import { loadUserAvatars } from '../../actions/user'

class UserAvatars extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.refs.streamComponent) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(this.getAction(nextProps))
    }
  }

  getAction(props) {
    const { endpoint, resultKey } = props
    return loadUserAvatars(endpoint, resultKey)
  }

  render() {
    const { icon } = this.props
    return (
      <section className="UserAvatars">
        {icon}
        <StreamComponent
          ref="streamComponent"
          action={this.getAction(this.props)} />
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

