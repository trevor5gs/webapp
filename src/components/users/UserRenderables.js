/* eslint-disable react/no-multi-comp */
import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import { ShareIcon } from '../assets/Icons'
import RelationshipContainer from '../../containers/RelationshipContainer'
import {
  UserFeaturedButton,
  UserFiguresCell,
  UserInfoCell,
  UserLinksCell,
  UserLocationCell,
  UserNamesCell,
  UserNamesCellCard,
  UserProfileButtons,
  UserStatsCell,
} from './UserParts'

// -----------------

export class UserCompact extends PureComponent {
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    relationshipPriority: PropTypes.string,
    username: PropTypes.string.isRequired,
  }
  static defaultProps = {
    relationshipPriority: null,
  }
  render() {
    const { avatar, id, relationshipPriority, username } = this.props
    return (
      <div className="UserCompact">
        <div className="UserCompactHeader">
          <Link className="UserCompactUserLink truncate" to={`/${username}`}>
            <Avatar
              priority={relationshipPriority}
              sources={avatar}
              userId={id}
              username={username}
            />
            <span className="UserCompactUsername">{`@${username}`}</span>
          </Link>
        </div>
        <RelationshipContainer relationshipPriority={relationshipPriority} userId={id} />
      </div>
    )
  }
}

// -----------------

// TODO: Move to InvitationRenderable?
export class UserInvitee extends PureComponent {
  static contextTypes = {
    onClickReInvite: PropTypes.func.isRequired,
  }
  static propTypes = {
    avatar: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    invitationAcceptedAt: PropTypes.string,
    invitationEmail: PropTypes.string,
    relationshipPriority: PropTypes.string,
    username: PropTypes.string,
  }
  static defaultProps = {
    avatar: null,
    className: null,
    id: null,
    invitationAcceptedAt: null,
    invitationEmail: null,
    relationshipPriority: null,
    username: null,
  }
  render() {
    const {
      avatar,
      id,
      invitationAcceptedAt,
      invitationEmail,
      relationshipPriority,
      username,
    } = this.props
    if (invitationAcceptedAt) {
      return (
        <div className={classNames(this.props.className, 'UserInvitee')}>
          <div className="UserInviteeHeader">
            <Link className="UserInviteeUserLink truncate" to={`/${username}`}>
              <Avatar
                priority={relationshipPriority}
                sources={avatar}
                userId={id}
                username={username}
              />
              <span className="UserInviteeUsername">{`@${username}`}</span>
            </Link>
          </div>
          <RelationshipContainer userId={id} />
        </div>
      )
    } else if (invitationEmail) {
      return (
        <div className={classNames(this.props.className, 'UserInvitee')}>
          <div className="UserInviteeHeader">
            <a className="UserInviteeUserLink truncate" href={`mailto: ${invitationEmail}`}>
              <Avatar />
              <span className="UserInviteeEmail">{invitationEmail}</span>
            </a>
          </div>
          <button className="UserInviteeAction" onClick={this.context.onClickReInvite}>
            <span>Re-Invite</span>
          </button>
        </div>
      )
    }
    return null
  }
}

// -----------------

export class UserProfileCard extends PureComponent {
  static contextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenFeaturedModal: PropTypes.func,
  }
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    coverImage: PropTypes.object.isRequired,
    followersCount: React.PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    followingCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isMiniProfileCard: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }
  static defaultProps = {
    name: null,
    relationshipPriority: null,
  }
  render() {
    const { onClickCollab, onClickHireMe, onClickOpenFeaturedModal } = this.context
    const {
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
    } = this.props
    return (
      <div className={classNames('UserProfileCard', { isMiniProfileCard })}>
        <Avatar
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          priority={relationshipPriority}
          size={isMobile || isMiniProfileCard ? 'regular' : 'large'}
          sources={avatar}
          to={`/${username}`}
          userId={id}
          username={username}
        />
        <UserProfileButtons
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          onClickCollab={onClickCollab}
          onClickHireMe={onClickHireMe}
        >
          <RelationshipContainer
            className="isPill inUserProfileCard"
            relationshipPriority={relationshipPriority}
            userId={id}
          />
        </UserProfileButtons>
        <UserNamesCellCard
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          name={name}
          username={username}
        />
        <UserStatsCell
          className={classNames('inUserProfileCard', { isMiniProfileCard })}
          followingCount={followingCount}
          followersCount={followersCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        { (!isMobile && !isMiniProfileCard) &&
          <UserInfoCell
            className="inUserProfileCard"
            truncatedShortBio={truncatedShortBio}
          />
        }
        <BackgroundImage
          className={classNames('inUserProfileCard hasOverlay6', { isMiniProfileCard })}
          dpi={'xhdpi'}
          sources={coverImage}
          to={`/${username}`}
        />
        { onClickOpenFeaturedModal &&
          <UserFeaturedButton
            className={classNames('inUserProfileCard', { isMiniProfileCard })}
            onClick={onClickOpenFeaturedModal}
          />
        }
      </div>
    )
  }
}
// -----------------

export class UserProfile extends PureComponent {
  static contextTypes = {
    onClickCollab: PropTypes.func,
    onClickHireMe: PropTypes.func,
    onClickOpenBio: PropTypes.func,
    onClickOpenFeaturedModal: PropTypes.func,
    onClickShareProfile: PropTypes.func.isRequired,
  }
  static propTypes = {
    avatar: PropTypes.object.isRequired,
    externalLinksList: PropTypes.object,
    followersCount: React.PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    followingCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isCollaborateable: PropTypes.bool.isRequired,
    isHireable: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    location: PropTypes.string,
    lovesCount: PropTypes.number.isRequired,
    name: PropTypes.string,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    totalViewsCount: PropTypes.string,
    truncatedShortBio: PropTypes.string.isRequired,
    useGif: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
  }

  static defaultProps = {
    externalLinksList: null,
    location: null,
    name: null,
    relationshipPriority: null,
    totalViewsCount: null,
  }

  render() {
    const {
      onClickCollab,
      onClickHireMe,
      onClickOpenBio,
      onClickOpenFeaturedModal,
      onClickShareProfile,
    } = this.context
    const {
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
    } = this.props
    return (
      <div className="UserProfile">
        <Avatar
          alt={name || username}
          className="inUserProfile"
          priority={relationshipPriority}
          size="large"
          sources={avatar}
          useGif={useGif}
          userId={id}
          username={username}
        />
        <UserNamesCell
          className="inUserProfile"
          name={name}
          username={username}
        >
          {onClickOpenFeaturedModal && !totalViewsCount &&
            <UserFeaturedButton
              className="inUserProfile withoutTotalViewCount"
              onClick={onClickOpenFeaturedModal}
            />
          }
          {isLoggedIn && !isSelf ?
            <RelationshipContainer
              hasBlockMuteButton
              className="inUserProfile"
              relationshipPriority={relationshipPriority}
              userId={id}
            /> : null
          }
        </UserNamesCell>
        {totalViewsCount ?
          <UserFiguresCell
            className="inUserProfile"
            onClickOpenFeaturedModal={onClickOpenFeaturedModal}
            onClickShareProfile={onClickShareProfile}
            totalViewsCount={totalViewsCount}
          /> :
          <button className="UserFiguresShareButton withoutTotalViewCount" onClick={onClickShareProfile} >
            <ShareIcon />
          </button>
        }
        <UserStatsCell
          className="inUserProfile"
          followersCount={followersCount}
          followingCount={followingCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        <UserLocationCell
          className="inUserProfile"
          location={location}
        />
        <UserInfoCell
          className="inUserProfile"
          onClickOpenBio={onClickOpenBio}
          truncatedShortBio={truncatedShortBio}
        />
        <UserLinksCell
          className="inUserProfile"
          externalLinksList={externalLinksList}
          isMobile={isMobile}
        />
        <UserProfileButtons
          className="inUserProfile"
          onClickCollab={isCollaborateable ? onClickCollab : null}
          onClickHireMe={isHireable ? onClickHireMe : null}
        >
          <RelationshipContainer
            className="isPill inUserProfile"
            relationshipPriority={relationshipPriority}
            userId={id}
          />
        </UserProfileButtons>
      </div>
    )
  }
}

