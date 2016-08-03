import React, { PropTypes } from 'react'
import { loadUserDrawer } from '../../actions/user'
import StreamContainer from '../../containers/StreamContainer'

const UserDrawer = ({ endpoint, icon, post, resultType }) =>
  <section className="UserDrawer">
    {icon}
    <StreamContainer
      action={loadUserDrawer(endpoint, post, resultType)}
      paginatorText="+more"
      ignoresScrollPosition
    />
  </section>

UserDrawer.propTypes = {
  endpoint: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
  post: PropTypes.object.isRequired,
  resultType: PropTypes.string.isRequired,
}


export default UserDrawer

