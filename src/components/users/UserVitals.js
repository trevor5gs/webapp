/* eslint-disable no-confusing-arrow */
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { numberToHuman } from '../../vendor/number_to_human'

export const UserDetailUserNames = ({ user }) =>
  <div className="UserNames">
    <h1 className="UserUsername">
      <Link to={`/${user.username}`} >{user.name ? user.name : `@${user.username}`}</Link>
    </h1>
    {user.name ? <h2 className="UserName">@{user.username}</h2> : null}
  </div>

UserDetailUserNames.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
}

export const UserNames = ({ user }) =>
  <div className="UserNames">
    <h2 className="UserUsername">
      <Link to={`/${user.username}`} >@{user.username}</Link>
    </h2>
    <h3 className="UserName">{user.name}</h3>
  </div>

UserNames.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
}

const UserStatsLink = ({ asDisabled = false, children, to }) =>
  asDisabled ?
    <span className="UserStatsLink asDisabled">
      {children}
    </span> :
    <Link activeClassName="isActive" className="UserStatsLink" to={to}>
      {children}
    </Link>

UserStatsLink.propTypes = {
  asDisabled: PropTypes.bool,
  children: PropTypes.node,
  to: PropTypes.string,
}

export const UserStats = ({ followingCount, followersCount, lovesCount, postsCount, username }) =>
  <div className="UserStats">
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

UserStats.propTypes = {
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  lovesCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
}


export const UserInfo = ({ user }) => {
  let externalLinks = []
  if (user.externalLinksList) {
    externalLinks = user.externalLinksList.map((link, i) =>
      <a href={link.url} key={i} rel="noopener noreferrer" target="_blank">{link.text}</a>
    )
  }
  return (
    <div className="UserInfo">
      <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: user.formattedShortBio }} />
      <p className="UserExternalLinks">
        {externalLinks}
      </p>
    </div>
  )
}

UserInfo.propTypes = {
  user: PropTypes.shape({
    externalLinksList: PropTypes.array,
    formattedShortBio: PropTypes.string,
  }).isRequired,
}

