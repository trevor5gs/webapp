import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openModal } from '../../actions/modals'
import { updateRelationship } from '../../actions/relationships'
import { trackEvent } from '../../actions/tracking'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import RelationshipButton from '../relationships/RelationshipButton'
import StarshipButton from '../relationships/StarshipButton'

class RelationsGroup extends Component {

  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    // During on-boarding relationships are batch updated.
    // TODO: When fully wired up this will actually have to split and be
    // changed to something like `batchUpdateRelationship`
    if (pathname && (/^\/onboarding/).test(pathname)) {
      return dispatch(updateRelationship(userId, priority, existing))
    }
    return dispatch(updateRelationship(userId, priority, existing))
  }

  handleLaunchSignUpModal() {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    return dispatch(trackEvent('open-registration-request-follow-button'))
  }

  render() {
    const { isLoggedIn, user } = this.props
    const callback = isLoggedIn ?
                     this.handleRelationshipUpdate.bind(this) :
                     this.handleLaunchSignUpModal.bind(this)
    return (
      <div className="RelationsGroup" >
        <RelationshipButton
          buttonWasClicked={callback}
          isLoggedIn={isLoggedIn}
          priority={user.relationshipPriority}
          ref="RelationshipButton"
          userId={user.id}
        />
        <StarshipButton
          buttonWasClicked={callback}
          isLoggedIn={isLoggedIn}
          priority={user.relationshipPriority}
          ref="StarshipButton"
          userId={user.id}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.router.path,
  }
}

RelationsGroup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  pathname: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    priority: PropTypes.string,
  }).isRequired,
}

export default connect(mapStateToProps, null, null, { withRef: true })(RelationsGroup)

