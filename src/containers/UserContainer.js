import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import shallowCompare from 'react-addons-shallow-compare'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import { selectViewsAdultContent } from '../selectors/profile'
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
import { TextMarkupDialog, FeaturedInDialog } from '../components/dialogs/DialogRenderables'
import { closeModal, openModal } from '../actions/modals'
import { trackEvent } from '../actions/analytics'
import { collabWithUser, hireUser } from '../actions/user'
import { getElloPlatform } from '../lib/jello'
import { getLinkArray } from '../helpers/json_helper'

const selectJson = state => state.json || {}

const selectUserCategories = createSelector(
  [selectUserFromPropsUserId, selectJson], (user, json) =>
    getLinkArray(user, 'categories', json) || []
)

export function mapStateToProps(state, props) {
  const user = selectUserFromPropsUserId(state, props)
  const categories = selectUserCategories(state, props)
  const truncatedShortBio = selectTruncatedShortBio(state, props)
  const deviceSize = selectDeviceSize(state)
  return {
    categories,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    isFeatured: !!(categories && categories.length),
    isLoggedIn: selectIsLoggedIn(state),
    isShortBioTruncated: truncatedShortBio.text.length >= 150,
    isMobile: deviceSize === 'mobile',
    lovesCount: user.lovesCount,
    postsCount: user.postsCount,
    relationshipPriority: user.relationshipPriority,
    truncatedShortBio: truncatedShortBio.html,
    useGif: selectViewsAdultContent(state) || !user.postsAdultContent,
    user,
    username: user.username,
  }
}

/* eslint-disable react/no-unused-prop-types */
class UserContainer extends Component {
  static propTypes = {
    categories: PropTypes.array,
    className: PropTypes.string,
    dispatch: PropTypes.func,
    followingCount: PropTypes.number,
    followersCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isFeatured: PropTypes.bool,
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
    useGif: PropTypes.bool,
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
      isMobile ? 'isFlex hasOverlay9' : 'hasOverlay9'
    ))
  }

  onClickShareProfile = () => {
    const { dispatch, user } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={user.username} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onClickOpenFeaturedModal = () => {
    const { categories, dispatch, isMobile } = this.props
    const len = categories.length
    const links = categories.map((category, index) => {
      let postfix = ''
      if (index < len - 2) {
        postfix = ', '
      } else if (index < len - 1) {
        postfix = ', & '
      }
      return [<Link to={`/discover/${category.slug}`}>{category.name}</Link>, postfix]
    })
    dispatch(openModal(
      <FeaturedInDialog>{['Featured in '].concat(links)}</FeaturedInDialog>,
      isMobile ? 'isFlex' : null
    ))
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
      className,
      isFeatured,
      isLoggedIn,
      isMobile,
      isShortBioTruncated,
      truncatedShortBio,
      type,
      useGif,
      user,
    } = this.props
    const onHireMeFunc = isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal
    const onCollabFunc = isLoggedIn ? this.onOpenCollabModal : this.onOpenSignupModal
    const onClickOpenBio = isShortBioTruncated ? this.onClickOpenBio : null
    const onClickOpenFeaturedModal = isFeatured ? this.onClickOpenFeaturedModal : null
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
            onClickOpenFeaturedModal={onClickOpenFeaturedModal}
            truncatedShortBio={truncatedShortBio}
            user={user}
          />
        )
      case 'profile':
        return (
          <UserProfile
            isLoggedIn={isLoggedIn}
            isMobile={isMobile}
            onClickCollab={onCollabFunc}
            onClickHireMe={onHireMeFunc}
            onClickOpenBio={onClickOpenBio}
            onClickOpenFeaturedModal={onClickOpenFeaturedModal}
            onClickShareProfile={this.onClickShareProfile}
            truncatedShortBio={truncatedShortBio}
            useGif={useGif}
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

