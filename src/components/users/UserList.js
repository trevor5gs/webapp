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
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserList extends Component {

  static propTypes = {
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool,
    relationshipPriority: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    uploader: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
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
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  render() {
    const { classList, relationshipPriority, user, uploader, showBlockMuteButton } = this.props
    const userPath = `/${user.username}`
    const isModifiable = uploader ? true : undefined
    return (
      <div className={ classNames(classList, 'UserList') }>
        { uploader }
        <Avatar
          isModifiable={ isModifiable }
          priority={ !isModifiable && relationshipPriority ? relationshipPriority : null }
          size="large"
          sources={ user.avatar }
          to={ isModifiable ? null : userPath }
          userId={ !isModifiable ? `${user.id}` : null }
          username={ !isModifiable ? user.username : null }
        />
        <RelationsGroup
          user={ user }
          relationshipPriority={ relationshipPriority }
          showBlockMuteButton={ showBlockMuteButton }
        />
        <UserNames user={ user } />
        <UserStats user={ user } />
        <UserInfo user={ user } />
        <ShareProfileButton onClick={ this.onClickShareProfile } >
          Share Profile
        </ShareProfileButton>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    relationshipPriority: user.relationshipPriority,
    user,
  }
}

export default connect(mapStateToProps)(UserList)

