import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import RelationsGroup from '../relationships/RelationsGroup'

const UserCompact = ({ user, className }) =>
  <div className={ classNames(className, 'UserCompact') }>
    <div className="UserCompactHeader">
      <Link className="UserCompactUserLink" to={ `/${user.username}` }>
        <Avatar
          priority={ user.relationshipPriority }
          sources={ user.avatar }
          userId={ `${user.id}` }
          username={ user.username }
        />
        <span className="UserCompactUsername">{ `@${user.username}` }</span>
      </Link>
    </div>
    <RelationsGroup user={ user } />
  </div>

UserCompact.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({}),
}

export default UserCompact

