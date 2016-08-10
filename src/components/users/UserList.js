import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { getElloPlatform } from '../../vendor/jello'
import Avatar from '../assets/Avatar'
import { openModal, closeModal } from '../../actions/modals'
import { trackEvent } from '../../actions/tracking'
import { sendMessage } from '../../actions/user'
import { MiniPillButton } from '../buttons/Buttons'
import MessageDialog from '../dialogs/MessageDialog'
import ShareDialog from '../dialogs/ShareDialog'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import { ShareIcon } from '../users/UserIcons'
import { UserDetailUserNames, UserNames, UserStats, UserInfo } from '../users/UserVitals'
import RelationshipContainer from '../../containers/RelationshipContainer'

class UserList extends Component {

  static propTypes = {
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    isHireable: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isUserDetail: PropTypes.bool,
    lovesCount: PropTypes.number.isRequired,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    uploader: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    useGif: PropTypes.bool,
    user: PropTypes.shape({
    }).isRequired,
    username: PropTypes.string.isRequired,
  }

  static defaultProps = {
    classList: '',
    showBlockMuteButton: false,
    useGif: false,
  }

  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return false
    }
    return true
  }

  onClickShareProfile = () => {
    const { dispatch, user } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog user={user} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onClickHireMe = () => {
    const { dispatch, user } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.name ? user.name : user.username}`}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
      />
    ))
    dispatch(trackEvent('open-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmHireMe = ({ message }) => {
    const { dispatch, user } = this.props
    dispatch(sendMessage(user.id, message))
    dispatch(trackEvent('send-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onDismissModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onOpenSignupModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'isDecapitated'))
    dispatch(trackEvent('open-registration-request-hire-me-button'))
  }

  render() {
    const { classList, followingCount, followersCount, isHireable, isLoggedIn, isUserDetail,
      lovesCount, relationshipPriority, postsCount, showBlockMuteButton,
      uploader, useGif, user, username } = this.props
    const userPath = `/${user.username}`
    const isModifiable = uploader ? true : undefined
    return (
      <div className={classNames(classList, 'UserList')}>
        {uploader}
        <Avatar
          alt={isUserDetail && user.name ? user.name : user.username}
          className="isLarge"
          isModifiable={isModifiable}
          priority={!isModifiable && relationshipPriority ? relationshipPriority : null}
          size="large"
          sources={user.avatar}
          to={isModifiable ? null : userPath}
          useGif={useGif && (user.viewsAdultContent || !user.postsAdultContent)}
          userId={!isModifiable ? `${user.id}` : null}
          username={!isModifiable ? user.username : null}
        />
        <RelationshipContainer
          hasBlockMuteButton={showBlockMuteButton}
          relationshipPriority={relationshipPriority}
          user={user}
        />
        {isUserDetail ? <UserDetailUserNames user={user} /> : <UserNames user={user} />}
        <UserStats
          followingCount={followingCount}
          followersCount={followersCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        <UserInfo user={user} />
        {isHireable ?
          <div className="ProfileButtons">
            <MiniPillButton onClick={isLoggedIn ? this.onClickHireMe : this.onOpenSignupModal} >
              Hire Me
            </MiniPillButton>
            <button className="ProfileButtonsShareButton" onClick={this.onClickShareProfile} >
              <ShareIcon />
            </button>
          </div>
          :
          <div className="ProfileButtons">
            <MiniPillButton onClick={this.onClickShareProfile} >
              Share Profile
            </MiniPillButton>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    followingCount: user.followingCount,
    followersCount: user.followersCount,
    isHireable: user.isHireable,
    isLoggedIn: state.authentication.isLoggedIn,
    lovesCount: user.lovesCount,
    relationshipPriority: user.relationshipPriority,
    postsCount: user.postsCount,
    user,
    username: user.username,
  }
}

export default connect(mapStateToProps)(UserList)

