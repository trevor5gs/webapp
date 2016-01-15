import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openModal } from '../../actions/modals'
import { updateRelationship } from '../../actions/relationships'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import RelationshipImageButton from '../relationships/RelationshipImageButton'

class UserCard extends Component {

  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      return dispatch(updateRelationship(userId, priority, existing, true))
    }
    return dispatch(updateRelationship(userId, priority, existing))
  }

  handleLaunchSignUpModal() {
    const { dispatch } = this.props
    return dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
  }

  render() {
    const { isLoggedIn, user } = this.props
    const callback = isLoggedIn ?
                     this.handleRelationshipUpdate.bind(this) :
                     this.handleLaunchSignUpModal.bind(this)
    return (
      <div className="UserCard" >
        <RelationshipImageButton
          buttonWasClicked={callback}
          coverSrc={user.coverImage.hdpi.url}
          isLoggedIn={isLoggedIn}
          priority={user.relationshipPriority}
          ref="RelationshipImageButton"
          userId={user.id}
          username={'@' + user.username}
        />
      </div>
    )
  }
}

UserCard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  pathname: PropTypes.string,
  user: PropTypes.shape({
  }).isRequired,
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.router.path,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(UserCard)

