import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { openModal, closeModal } from '../../actions/modals'
import { updateRelationship } from '../../actions/relationships'
import { trackEvent } from '../../actions/tracking'
import BlockMuteDialog from '../dialogs/BlockMuteDialog'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import BlockMuteButton from '../relationships/BlockMuteButton'
import RelationshipButton from '../relationships/RelationshipButton'
import StarshipButton from '../relationships/StarshipButton'

class RelationsGroup extends Component {

  isBlockedOrMuted() {
    const { user } = this.props
    const status = user.relationshipPriority
    return status && status === RELATIONSHIP_PRIORITY.BLOCK || status === RELATIONSHIP_PRIORITY.MUTE
  }

  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      return dispatch(updateRelationship(userId, priority, existing, true))
    }
    return dispatch(updateRelationship(userId, priority, existing))
  }

  closeModal() {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  launchBlockMutePrompt() {
    const { dispatch, user } = this.props
    const priority = user.relationshipPriority
    dispatch(openModal(
      <BlockMuteDialog
        onBlock={ ::this.closeModal }
        onMute={ ::this.closeModal }
        blockIsActive={ priority === RELATIONSHIP_PRIORITY.BLOCK }
        muteIsActive={ priority === RELATIONSHIP_PRIORITY.MUTE }
        username = { user.username }
      />
    , 'asDangerZone'))
  }

  handleLaunchSignUpModal() {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    return dispatch(trackEvent('open-registration-request-follow-button'))
  }

  shouldRenderBlockMute() {
    const { isLoggedIn, showBlockMuteButton, user } = this.props
    const { relationshipPriority } = user
    return isLoggedIn && showBlockMuteButton && relationshipPriority !== RELATIONSHIP_PRIORITY.SELF
  }

  renderBlockMuteButton() {
    const { user } = this.props
    return (
      <BlockMuteButton
        onClick={ ::this.launchBlockMutePrompt }
        priority={ user.relationshipPriority }
        userId={ user.id }
      />
    )
  }

  render() {
    const { isLoggedIn, user } = this.props
    const callback = this.isBlockedOrMuted() ?
                     (::this.launchBlockMutePrompt) :
                     (::this.handleRelationshipUpdate)

    return (
      <div className="RelationsGroup" >
        { this.shouldRenderBlockMute() ? this.renderBlockMuteButton() : null }
        <RelationshipButton
          buttonWasClicked={ isLoggedIn ? callback : ::this.handleLaunchSignUpModal }
          isLoggedIn={ isLoggedIn }
          priority={ user.relationshipPriority }
          ref="RelationshipButton"
          userId={ user.id }
        />
        <StarshipButton
          buttonWasClicked={ isLoggedIn ? callback : ::this.handleLaunchSignUpModal }
          isLoggedIn={ isLoggedIn }
          priority={ user.relationshipPriority }
          ref="StarshipButton"
          userId={ user.id }
        />
      </div>
    )
  }
}

RelationsGroup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  pathname: PropTypes.string,
  showBlockMuteButton: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string,
    relationshipPriority: PropTypes.string,
  }).isRequired,
}

RelationsGroup.defaultProps = {
  showBlockMuteButton: false,
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.router.path,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(RelationsGroup)

