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
  };

  onClickRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      return dispatch(updateRelationship(userId, priority, existing, true))
    }
    return dispatch(updateRelationship(userId, priority, existing))
  }

  onClickOpenSignupModal() {
    const { dispatch } = this.props
    return dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
  }

  render() {
    const { isLoggedIn, user } = this.props
    const callback = isLoggedIn ?
                     this.onClickRelationshipUpdate.bind(this) :
                     this.onClickOpenSignupModal.bind(this)
    return (
      <div className="UserCard" >
        <RelationshipImageButton
          onClick={callback}
          coverSrc={user.coverImage.hdpi.url}
          isLoggedIn={isLoggedIn}
          priority={user.relationshipPriority}
          ref="RelationshipImageButton"
          userId={user.id}
          username={ `@${user.username}` }
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(UserCard)
