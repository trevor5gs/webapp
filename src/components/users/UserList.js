import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import RelationsGroup from '../relationships/RelationsGroup'
import { LoggedOutUserStats, UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserList extends Component {

  static propTypes = {
    classList: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    showBlockMuteButton: PropTypes.bool,
    user: PropTypes.shape({
    }).isRequired,
  };

  static defaultProps = {
    classList: '',
    showBlockMuteButton: false,
  };

  render() {
    const { classList, isLoggedIn, user, showBlockMuteButton } = this.props
    const userPath = `/${user.username}`
    const stats = isLoggedIn ? <UserStats user={ user }/> : <LoggedOutUserStats user={ user }/>
    return (
      <div className={ classNames(classList, 'UserList') }>
        <Avatar to={ userPath } sources={ user.avatar } size="large"/>
        <RelationsGroup user={ user } showBlockMuteButton={ showBlockMuteButton }/>
        <UserNames user={ user }/>
        { stats }
        <UserInfo user={ user }/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
  }
}

export default connect(mapStateToProps)(UserList)

