import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import { openModal } from '../../actions/modals'
import { trackEvent } from '../../actions/tracking'
import RelationsGroup from '../relationships/RelationsGroup'
import ShareProfileButton from './ShareProfileButton'
import ShareDialog from '../dialogs/ShareDialog'
import { LoggedOutUserStats, UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserList extends Component {

  static propTypes = {
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    showBlockMuteButton: PropTypes.bool,
    user: PropTypes.shape({
    }).isRequired,
  }

  static defaultProps = {
    classList: '',
    showBlockMuteButton: false,
  }

  shouldComponentUpdate(prevProps) {
    if (_.isEqual(prevProps, this.props)) {
      return false
    }
    return true
  }

  onClickShareProfile = () => {
    const { dispatch, user } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog user={ user } trackEvent={ action } />))
    return dispatch(trackEvent('open-share-dialog-profile'))
  }

  render() {
    const { classList, isLoggedIn, user, showBlockMuteButton } = this.props
    const userPath = `/${user.username}`
    const stats = isLoggedIn ? <UserStats user={ user } /> : <LoggedOutUserStats user={ user } />
    return (
      <div className={ classNames(classList, 'UserList') }>
        <Avatar to={ userPath } sources={ user.avatar } size="large" />
        <RelationsGroup user={ user } showBlockMuteButton={ showBlockMuteButton } />
        <UserNames user={ user } />
        { stats }
        <UserInfo user={ user } />
        <ShareProfileButton onClick={ this.onClickShareProfile } >
          Share Profile
        </ShareProfileButton>
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

