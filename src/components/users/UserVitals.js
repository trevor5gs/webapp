import React, { PropTypes } from 'react'
import { Link } from 'react-router'

export const UserNames = ({ user }) =>
  <div className="UserNames">
    <h2 className="UserUsername">
      <Link to={ `/${user.username}` } >@{user.username}</Link>
    </h2>
    <h3 className="UserName">{user.name}</h3>
  </div>

UserNames.propTypes = {
  user: PropTypes.shape({}).isRequired,
}


export const UserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <Link className="UserStatsLink" activeClassName="active" to={`/${user.username}`}>
        <dt>{user.postsCount}</dt>
        <dd>Posts</dd>
      </Link>
    </dl>
    <dl>
      <Link
        className="UserStatsLink"
        activeClassName="active"
        to={`/${user.username}/following`}
      >
        <dt>{user.followingCount}</dt>
        <dd>Following</dd>
      </Link>
    </dl>
    <dl>
      <Link
        className="UserStatsLink"
        activeClassName="active"
        to={`/${user.username}/followers`}
      >
        <dt>{user.followersCount}</dt>
        <dd>Followers</dd>
      </Link>
    </dl>
    <dl>
      <Link
        className="UserStatsLink"
        activeClassName="active"
        to={`/${user.username}/loves`}
      >
        <dt>{user.lovesCount}</dt>
        <dd>Loves</dd>
      </Link>
    </dl>
  </div>

UserStats.propTypes = {
  user: PropTypes.shape({}).isRequired,
}

export const LoggedOutUserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <span className="UserStatsLink asDisabled" activeClassName="active" to={`/${user.username}`}>
        <dt>{user.postsCount}</dt>
        <dd>Posts</dd>
      </span>
    </dl>
    <dl>
      <span
        className="UserStatsLink asDisabled"
        activeClassName="active"
        to={`/${user.username}/following`}
      >
        <dt>{user.followingCount}</dt>
        <dd>Following</dd>
      </span>
    </dl>
    <dl>
      <span
        className="UserStatsLink asDisabled"
        activeClassName="active"
        to={`/${user.username}/followers`}
      >
        <dt>{user.followersCount}</dt>
        <dd>Followers</dd>
      </span>
    </dl>
    <dl>
      <span
        className="UserStatsLink asDisabled"
        activeClassName="active"
        to={`/${user.username}/loves`}
      >
        <dt>{user.lovesCount}</dt>
        <dd>Loves</dd>
      </span>
    </dl>
  </div>

LoggedOutUserStats.propTypes = {
  user: PropTypes.shape({}).isRequired,
}

export const UserInfo = ({ user }) => {
  let externalLinks = []
  if (user.externalLinksList) {
    externalLinks = user.externalLinksList.map((link, i) =>
      <a href={link.url} target="_blank" key={i} >{link.text}</a>
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
  user: PropTypes.shape({}).isRequired,
}

