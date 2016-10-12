import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { numberToHuman } from '../../lib/number_to_human'
import { BadgeCheckIcon, ShareIcon } from '../assets/Icons'
import { MiniPillButton } from '../buttons/Buttons'

// -------------------------------------

const UserStatsLink = ({ asDisabled = false, children, to }, { onClickScrollToContent }) =>
  (asDisabled ?
    <span className="UserStatsLink asDisabled">
      {children}
    </span> :
      <Link onClick={onClickScrollToContent} className="UserStatsLink" to={to}>
        {children}
      </Link>)

UserStatsLink.propTypes = {
  asDisabled: PropTypes.bool,
  children: PropTypes.node,
  to: PropTypes.string,
}
UserStatsLink.contextTypes = {
  onClickScrollToContent: PropTypes.func,
}

// -----------------

export const UserNamesCell = ({ className, name, username, children }) =>
  <div className={classNames('UserCell UserNamesCell', className, { isSingle: !name })}>
    <h1 className="UserName">
      <Link className="truncate" to={`/${username}`} >{name || `@${username}`}</Link>
    </h1>
    {name ? <h2 className="UserUsername truncate">@{username}</h2> : null}
    { children }
  </div>

UserNamesCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserNamesCellCard = ({ className, name, username }) =>
  <div className={classNames('UserCell UserNamesCell', className)}>
    <h2 className="UserName">
      <Link className="truncate" to={`/${username}`} >{name || `@${username}`}</Link>
    </h2>
    {name ? <h3 className="UserUsername truncate">@{username}</h3> : null}
  </div>

UserNamesCellCard.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserFiguresCell = ({
  className,
  onClickOpenFeaturedModal,
  onClickShareProfile,
  totalPostViewsCount,
}) =>
  <div className={classNames('UserCell UserFiguresCell', className)}>
    { totalPostViewsCount ? <span className="UserFiguresCount uppercase">{totalPostViewsCount} </span> : null }
    { totalPostViewsCount ? <span className="UserFiguresLabel">Total Views</span> : null }
    { onClickOpenFeaturedModal || onClickShareProfile ?
      <div className="UserFiguresButtons">
      { onClickOpenFeaturedModal ?
        <button className="UserFiguresFeaturedButton" onClick={onClickOpenFeaturedModal} >
          <BadgeCheckIcon />
        </button> : null
      }
      { onClickShareProfile ?
        <button className="UserFiguresShareButton" onClick={onClickShareProfile} >
          <ShareIcon />
        </button> : null
      }
      </div> : null
    }
  </div>

UserFiguresCell.propTypes = {
  className: PropTypes.string,
  onClickOpenFeaturedModal: PropTypes.func,
  onClickShareProfile: PropTypes.func,
  totalPostViewsCount: PropTypes.string,
}

// -----------------

export const UserStatsCell = ({
  className, followingCount, followersCount, lovesCount, postsCount, username,
}) =>
  <div className={classNames('UserCell UserStatsCell', className)}>
    <dl>
      <UserStatsLink to={`/${username}`}>
        <dt>{numberToHuman(postsCount)}</dt>
        <dd><span className="UserStatsCountLabel">Posts</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!followingCount} to={`/${username}/following`}>
        <dt>{numberToHuman(followingCount)}</dt>
        <dd><span className="UserStatsCountLabel">Following</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink
        asDisabled={typeof followersCount === 'string' || !followersCount}
        to={`/${username}/followers`}
      >
        <dt>
          {
            typeof followersCount === 'string' ?
              followersCount :
              numberToHuman(followersCount)
          }
        </dt>
        <dd><span className="UserStatsCountLabel">Followers</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!lovesCount} to={`/${username}/loves`} >
        <dt>{numberToHuman(lovesCount)}</dt>
        <dd><span className="UserStatsCountLabel">Loves</span></dd>
      </UserStatsLink>
    </dl>
  </div>

UserStatsCell.propTypes = {
  className: PropTypes.string,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  lovesCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
}

// -----------------

export const UserInfoCell = ({ className, location, onClickOpenBio, truncatedShortBio }) =>
  <div className={classNames('UserCell UserInfoCell', className)}>
    { truncatedShortBio && truncatedShortBio.length ?
      <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: truncatedShortBio }} /> : null
    }
    { onClickOpenBio ?
      <button className="MoreBioButton" onClick={onClickOpenBio} >
        <span className="MoreBioButtonLabel">See More</span>
      </button> : null
    }
    { location ? <p className="UserLocation">{location}</p> : null }
  </div>

UserInfoCell.propTypes = {
  className: PropTypes.string,
  location: PropTypes.string,
  onClickOpenBio: PropTypes.func,
  truncatedShortBio: PropTypes.string,
}

// -----------------

export const UserLinksCell = ({ className, externalLinksList, isMobile }) => {
  const externalLinks = []
  const externalLinksIcon = []
  if (externalLinksList && externalLinksList.length) {
    externalLinksList.forEach((link, i) => {
      if (link.icon) {
        externalLinksIcon.push(
          <span className="UserExternalLinksIcon" key={i}>
            <a href={link.url} rel="noopener noreferrer" target="_blank">
              <img alt={link.type} src={link.icon} />
            </a>
          </span>
        )
      } else {
        externalLinks.push(
          <span className="UserExternalLinksLabel" key={i}>
            <a href={link.url} rel="noopener noreferrer" target="_blank">{link.text}</a>
          </span>
        )
      }
    })
  }
  // Magic numbers explained:
  // 32 = the height of an icon (22) + the margin-top (10)
  // 34 = the top/bottom padding of the container (17)
  // 5 = top position of the right icon content
  const linkIconHeight = isMobile ?
    (Math.ceil(externalLinksIcon.length / 3) * 32) + 34 + 5 :
    (Math.ceil(externalLinksIcon.length / 4) * 32) + 34 + 5
  const style = externalLinksIcon.length > 0 ? { height: linkIconHeight } : { height: null }
  return (
    <div
      className={classNames('UserCell UserLinksCell', className)}
      data-num-icons={externalLinksIcon.length}
      style={style}
    >
      <div className="UserExternalLinksLeft">
        {externalLinks}
      </div>
      <div className="UserExternalLinksRight">
        {externalLinksIcon}
      </div>
    </div>
  )
}

UserLinksCell.propTypes = {
  className: PropTypes.string,
  externalLinksList: PropTypes.array,
  isMobile: PropTypes.bool,
}

export const UserProfileButtons = ({ children, className, onClickCollab, onClickHireMe }) =>
  <div className={classNames('UserProfileButtons', className)}>
    {onClickCollab ?
      <MiniPillButton className="size58" onClick={onClickCollab} >Collab</MiniPillButton> : null
    }
    {onClickHireMe ?
      <MiniPillButton className="size58" onClick={onClickHireMe} >Hire</MiniPillButton> : null
    }
    {children}
  </div>

UserProfileButtons.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClickCollab: PropTypes.func,
  onClickHireMe: PropTypes.func,
}

