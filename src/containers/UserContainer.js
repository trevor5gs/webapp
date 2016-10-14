import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import shallowCompare from 'react-addons-shallow-compare'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import { selectTruncatedShortBio, selectUserFromPropsUserId } from '../selectors/user'
import {
  UserAvatar,
  UserCompact,
  UserProfileCard,
  UserProfile,
} from '../components/users/UserRenderables'
import MessageDialog from '../components/dialogs/MessageDialog'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import { TextMarkupDialog } from '../components/dialogs/DialogRenderables'
import { closeModal, openModal } from '../actions/modals'
import { trackEvent } from '../actions/analytics'
import { collabWithUser, hireUser } from '../actions/user'
import { getElloPlatform } from '../lib/jello'

export function mapStateToProps(state, props) {
  const user = selectUserFromPropsUserId(state, props)
  const truncatedShortBio = selectTruncatedShortBio(state, props)
  const deviceSize = selectDeviceSize(state)
  return {
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    isLoggedIn: selectIsLoggedIn(state),
    isShortBioTruncated: truncatedShortBio.text.length >= 200,
    isMobile: deviceSize === 'mobile',
    lovesCount: user.lovesCount,
    postsCount: user.postsCount,
    relationshipPriority: user.relationshipPriority,
    truncatedShortBio: truncatedShortBio.html,
    user,
    username: user.username,
  }
}

/* eslint-disable react/no-unused-prop-types */
class UserContainer extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    followingCount: PropTypes.number,
    followersCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isLoggedIn: PropTypes.bool,
    isShortBioTruncated: PropTypes.bool,
    isMobile: PropTypes.bool,
    lovesCount: PropTypes.number,
    postsCount: PropTypes.number,
    relationshipPriority: PropTypes.string,
    truncatedShortBio: PropTypes.string,
    type: PropTypes.oneOf([
      'avatar',
      'compact',
      'grid',
      'profile',
    ]).isRequired,
    user: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    showBlockMuteButton: false,
    useGif: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickOpenBio = () => {
    const { dispatch, isMobile, user } = this.props
    dispatch(openModal(
      <TextMarkupDialog html={user.formattedShortBio} />,
      isMobile ? 'isFlex' : null
    ))
  }

  onClickShareProfile = () => {
    const { dispatch, user } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={user.username} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onOpenCollabModal = () => {
    const { dispatch, user } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.name ? user.name : user.username}`}
        onConfirm={this.onConfirmCollab}
        onDismiss={this.onDismissModal}
        titlePrefix="Collaborate with"
      />
    ))
    dispatch(trackEvent('open-collab-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmCollab = ({ message }) => {
    const { dispatch, user } = this.props
    dispatch(collabWithUser(user.id, message))
    dispatch(trackEvent('send-collab-dialog-profile', { platform: getElloPlatform() }))
  }

  onOpenHireMeModal = () => {
    const { dispatch, user } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.name ? user.name : user.username}`}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
        titlePrefix="Hire"
      />
    ))
    dispatch(trackEvent('open-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmHireMe = ({ message }) => {
    const { dispatch, user } = this.props
    dispatch(hireUser(user.id, message))
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
    const {
      className, isLoggedIn, isMobile, isShortBioTruncated, truncatedShortBio, type, user,
    } = this.props
    const onHireMeFunc = isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal
    const onCollabFunc = isLoggedIn ? this.onOpenCollabModal : this.onOpenSignupModal
    const onClickOpenBio = isShortBioTruncated ? this.onClickOpenBio : null
    switch (type) {
      case 'avatar':
        return <UserAvatar user={user} />
      case 'compact':
        return <UserCompact className={className} user={user} />
      case 'grid':
        return (
          <UserProfileCard
            isMobile={isMobile}
            onClickCollab={onCollabFunc}
            onClickHireMe={onHireMeFunc}
            onClickOpenBio={onClickOpenBio}
            truncatedShortBio={truncatedShortBio}
            user={user}
          />
        )
      case 'profile':
        return (
          <UserProfile
            isLoggedIn={isLoggedIn}
            onClickCollab={onCollabFunc}
            onClickHireMe={onHireMeFunc}
            onClickShareProfile={this.onClickShareProfile}
            onClickOpenBio={onClickOpenBio}
            truncatedShortBio={truncatedShortBio}
            user={user}
          />
        )
      default:
        return null
    }
  }
}
/* eslint-enable react/no-unused-prop-types */

export default connect(mapStateToProps)(UserContainer)

