import React, { PropTypes } from 'react'
import { loadUserAvatars } from '../../actions/user'
import StreamContainer from '../../containers/StreamContainer'

const UserAvatars = ({ endpoint, icon, post, resultType }) =>
  <section className="UserAvatars">
    {icon}
    <StreamContainer
      action={loadUserAvatars(endpoint, post, resultType)}
      paginatorText="+more"
      ignoresScrollPosition
    />
  </section>

UserAvatars.propTypes = {
  endpoint: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
  post: PropTypes.object.isRequired,
  resultType: PropTypes.string.isRequired,
}

export default UserAvatars

