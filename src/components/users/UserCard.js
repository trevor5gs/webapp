import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openModal } from '../../actions/modals'
import { updateRelationship } from '../../actions/relationships'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import RelationshipImageButton from '../relationships/RelationshipImageButton'

class UserCard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    user: PropTypes.shape({
    }).isRequired,
    relationshipPriority: PropTypes.string,
  }

  onClickRelationshipUpdate = (vo) => {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      dispatch(updateRelationship(userId, priority, existing, true))
      return
    }
    dispatch(updateRelationship(userId, priority, existing))
  }

  onClickOpenSignupModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'isDecapitated'))
  }

  render() {
    const { isLoggedIn, relationshipPriority, user } = this.props
    const callback = isLoggedIn ? this.onClickRelationshipUpdate : this.onClickOpenSignupModal
    return (
      <div className="UserCard" >
        <RelationshipImageButton
          coverSrc={user.coverImage.hdpi.url}
          isLoggedIn={isLoggedIn}
          onClick={callback}
          priority={relationshipPriority}
          ref="RelationshipImageButton"
          userId={user.id}
          username={`@${user.username}`}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.routing.location.pathname,
    relationshipPriority: user.relationshipPriority,
    user,
  }
}

export default connect(mapStateToProps)(UserCard)

