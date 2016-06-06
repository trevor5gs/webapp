/* eslint-disable no-confusing-arrow */
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { numberToHuman } from '../../vendor/number_to_human'

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
    <span activeClassName="active" className="UserStatsLink asDisabled">
      {children}
    </span> :
    <Link activeClassName="active" className="UserStatsLink" to={to}>
      {children}
    </Link>

UserStatsLink.propTypes = {
  asDisabled: PropTypes.bool,
  children: PropTypes.node,
  to: PropTypes.string,
}

export const UserStats = ({ user }) =>
  <div className="UserStats">
    <dl>
      <UserStatsLink to={`/${user.username}`}>
        <dt>{numberToHuman(user.postsCount)}</dt>
        <dd><span className="UserStatsCountLabel">Posts</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!user.followingCount} to={`/${user.username}/following`}>
        <dt>{numberToHuman(user.followingCount)}</dt>
        <dd><span className="UserStatsCountLabel">Following</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink
        asDisabled={typeof user.followersCount === 'string' || !user.followersCount}
        to={`/${user.username}/followers`}
      >
        <dt>
          {
            typeof user.followersCount === 'string' ?
              user.followersCount :
              numberToHuman(user.followersCount)
          }
        </dt>
        <dd><span className="UserStatsCountLabel">Followers</span></dd>
      </UserStatsLink>
    </dl>
    <dl>
      <UserStatsLink asDisabled={!user.lovesCount} to={`/${user.username}/loves`} >
        <dt>{numberToHuman(user.lovesCount)}</dt>
        <dd><span className="UserStatsCountLabel">Loves</span></dd>
      </UserStatsLink>
    </dl>
  </div>

UserStats.propTypes = {
  user: PropTypes.shape({
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    lovesCount: PropTypes.number.isRequired,
    postsCount: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
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
  user: PropTypes.shape({
    externalLinksList: PropTypes.array,
    formattedShortBio: PropTypes.string,
  }).isRequired,
}

