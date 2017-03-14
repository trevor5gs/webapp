import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsMobile } from '../selectors/gui'
import { selectInvitationAcceptedAt, selectInvitationEmail } from '../selectors/invitations'
import { selectViewsAdultContent } from '../selectors/profile'
import { selectIsPostDetail } from '../selectors/routing'
import {
  selectUser,
  selectUserAvatar,
  selectUserCategories,
  selectUserCoverImage,
  selectUserExternalLinksList,
  selectUserFollowersCount,
  selectUserFollowingCount,
  selectUserFormattedShortBio,
  selectUserId,
  selectUserIsCollaborateable,
  selectUserIsEmpty,
  selectUserIsFeatured,
  selectUserIsHireable,
  selectUserIsSelf,
  selectUserLocation,
  selectUserLovesCount,
  selectUserName,
  selectUserPostsAdultContent,
  selectUserPostsCount,
  selectUserRelationshipPriority,
  selectUserTotalViewsCount,
  selectUserTruncatedShortBio,
  selectUserUsername,
} from '../selectors/user'
import {
  UserCompact,
  UserInvitee,
  UserProfileCard,
  UserProfile,
} from '../components/users/UserRenderables'
import MessageDialog from '../components/dialogs/MessageDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import { TextMarkupDialog, FeaturedInDialog } from '../components/dialogs/DialogRenderables'
import { closeModal, openModal } from '../actions/modals'
import { trackEvent } from '../actions/analytics'
import { inviteUsers } from '../actions/invitations'
import { collabWithUser, hireUser } from '../actions/user'
import { getElloPlatform } from '../lib/jello'

export function makeMapStateToProps() {
  return (state, props) => {
    const truncatedShortBio = selectUserTruncatedShortBio(state, props)
    return {
      avatar: selectUserAvatar(state, props),
      coverImage: selectUserCoverImage(state, props),
      categories: selectUserCategories(state, props),
      externalLinksList: selectUserExternalLinksList(state, props),
      followersCount: selectUserFollowersCount(state, props),
      followingCount: selectUserFollowingCount(state, props),
      formattedShortBio: selectUserFormattedShortBio(state, props),
      id: selectUserId(state, props),
      invitationAcceptedAt: selectInvitationAcceptedAt(state, props),
      invitationEmail: selectInvitationEmail(state, props),
      isCollaborateable: selectUserIsCollaborateable(state, props),
      isFeatured: selectUserIsFeatured(state, props),
      isHireable: selectUserIsHireable(state, props),
      isLoggedIn: selectIsLoggedIn(state),
      isSelf: selectUserIsSelf(state, props),
      isShortBioTruncated: truncatedShortBio.text.length >= 150,
      isMiniProfileCard: selectIsPostDetail(state, props),
      isMobile: selectIsMobile(state),
      isUserEmpty: selectUserIsEmpty(state, props),
      location: selectUserLocation(state, props),
      lovesCount: selectUserLovesCount(state, props),
      name: selectUserName(state, props),
      postsCount: selectUserPostsCount(state, props),
      relationshipPriority: selectUserRelationshipPriority(state, props),
      totalViewsCount: selectUserTotalViewsCount(state, props),
      truncatedShortBio: truncatedShortBio.html,
      useGif: selectViewsAdultContent(state) || !selectUserPostsAdultContent(state, props),
      user: selectUser(state, props),
      username: selectUserUsername(state, props),
    }
  }
}

class UserContainer extends Component {

  static propTypes = {
    avatar: PropTypes.object,
    categories: PropTypes.object,
    className: PropTypes.string,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    externalLinksList: PropTypes.object,
    followersCount: React.PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    followingCount: PropTypes.number.isRequired,
    formattedShortBio: PropTypes.string,
    invitationAcceptedAt: PropTypes.string,
    invitationEmail: PropTypes.string,
    id: PropTypes.string,
    isCollaborateable: PropTypes.bool.isRequired,
    isFeatured: PropTypes.bool.isRequired,
    isHireable: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMiniProfileCard: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isShortBioTruncated: PropTypes.bool.isRequired,
    isUserEmpty: PropTypes.bool.isRequired,
    location: PropTypes.string,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    totalViewsCount: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'compact',
      'invitee',
      'grid',
      'profile',
    ]).isRequired,
    useGif: PropTypes.bool,
    user: PropTypes.object.isRequired,
    username: PropTypes.string,
  }

  static defaultProps = {
    avatar: null,
    coverImage: null,
    categories: null,
    className: null,
    externalLinksList: null,
    formattedShortBio: null,
    id: null,
    invitationAcceptedAt: null,
    invitationEmail: null,
    location: null,
    name: null,
    relationshipPriority: null,
    showBlockMuteButton: false,
    totalViewsCount: null,
    useGif: false,
    username: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  static childContextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenBio: PropTypes.func,
    onClickOpenFeaturedModal: PropTypes.func,
    onClickReInvite: PropTypes.func,
    onClickShareProfile: PropTypes.func.isRequired,
  }

  getChildContext() {
    const {
      isCollaborateable,
      isHireable,
      isFeatured,
      isLoggedIn,
      isShortBioTruncated,
    } = this.props
    const collabFunc = isLoggedIn ? this.onOpenCollabModal : this.onOpenSignupModal
    const hiremeFunc = isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal
    return {
      onClickCollab: isCollaborateable ? collabFunc : null,
      onClickHireMe: isHireable ? hiremeFunc : null,
      onClickOpenBio: isShortBioTruncated ? this.onClickOpenBio : null,
      onClickOpenFeaturedModal: isFeatured ? this.onClickOpenFeaturedModal : null,
      onClickReInvite: this.onClickReInvite,
      onClickShareProfile: this.onClickShareProfile,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.user, this.props.user) ||
      ['isLoggedIn', 'isMiniProfileCard', 'isMobile'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  onClickOpenBio = () => {
    const { dispatch, formattedShortBio, isMobile } = this.props
    dispatch(openModal(
      <TextMarkupDialog html={formattedShortBio} />,
      isMobile ? 'isFlex hasOverlay9' : 'hasOverlay9',
    ))
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onClickOpenFeaturedModal = () => {
    const { categories, dispatch, isMobile } = this.props
    const len = categories.size
    const links = categories.map((category, index) => {
      let postfix = ''
      if (index < len - 2) {
        postfix = ', '
      } else if (index < len - 1) {
        postfix = ', & '
      }
      return [<Link to={`/discover/${category.get('slug')}`}>{category.get('name')}</Link>, postfix]
    })
    dispatch(openModal(
      <FeaturedInDialog>{['Featured in '].concat(links.toArray())}</FeaturedInDialog>,
      isMobile ? 'isFlex' : null,
    ))
  }

  onOpenCollabModal = () => {
    const { dispatch, name, username } = this.props
    dispatch(openModal(
      <MessageDialog
        name={name || username}
        onConfirm={this.onConfirmCollab}
        onDismiss={this.onDismissModal}
        titlePrefix="Collaborate with"
      />,
    ))
    dispatch(trackEvent('open-collab-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmCollab = ({ message }) => {
    const { dispatch, id } = this.props
    dispatch(collabWithUser(id, message))
    dispatch(trackEvent('send-collab-dialog-profile', { platform: getElloPlatform() }))
  }

  onOpenHireMeModal = () => {
    const { dispatch, name, username } = this.props
    dispatch(openModal(
      <MessageDialog
        name={name || username}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
        titlePrefix="Hire"
      />,
    ))
    dispatch(trackEvent('open-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmHireMe = ({ message }) => {
    const { dispatch, id } = this.props
    dispatch(hireUser(id, message))
    dispatch(trackEvent('send-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onDismissModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('hire-me-button')
  }

  onClickReInvite = () => {
    const { dispatch, invitationEmail } = this.props
    dispatch(inviteUsers([invitationEmail]))
  }

  render() {
    const {
      avatar,
      className,
      coverImage,
      externalLinksList,
      followersCount,
      followingCount,
      id,
      invitationAcceptedAt,
      invitationEmail,
      isCollaborateable,
      isHireable,
      isLoggedIn,
      isMiniProfileCard,
      isMobile,
      isSelf,
      isUserEmpty,
      location,
      lovesCount,
      name,
      postsCount,
      relationshipPriority,
      totalViewsCount,
      truncatedShortBio,
      type,
      useGif,
      username,
    } = this.props
    if (isUserEmpty && !invitationEmail) { return null }
    switch (type) {
      case 'compact':
        return (
          <UserCompact {...{ avatar, id, relationshipPriority, username }} />
        )
        // TODO: Move to InvitationContainer?
      case 'invitee':
        return (
          <UserInvitee
            {...{
              avatar,
              className,
              id,
              invitationAcceptedAt,
              invitationEmail,
              relationshipPriority,
              username,
            }}
          />
        )
      case 'grid':
        return (
          <UserProfileCard
            {...{
              avatar,
              coverImage,
              followersCount,
              followingCount,
              id,
              isMiniProfileCard,
              isMobile,
              lovesCount,
              name,
              postsCount,
              relationshipPriority,
              truncatedShortBio,
              username,
            }}
          />
        )
      case 'profile':
        return (
          <UserProfile
            {...{
              avatar,
              externalLinksList,
              followersCount,
              followingCount,
              id,
              isCollaborateable,
              isHireable,
              isLoggedIn,
              isMobile,
              isSelf,
              location,
              lovesCount,
              name,
              postsCount,
              relationshipPriority,
              totalViewsCount,
              truncatedShortBio,
              useGif,
              username,
            }}
          />
        )
      default:
        return null
    }
  }
}

export default connect(makeMapStateToProps)(UserContainer)

