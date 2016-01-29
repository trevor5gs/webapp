import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
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

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    previousPath: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.string,
      relationshipPriority: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    showBlockMuteButton: false,
  };

  getNextPriority(props, btnId) {
    const { user } = props
    const priority = user.relationshipPriority
    switch (priority) {
      case RELATIONSHIP_PRIORITY.BLOCK:
      case RELATIONSHIP_PRIORITY.MUTE:
        return RELATIONSHIP_PRIORITY.INACTIVE
      default:
        switch (btnId) {
          case 'block':
            return RELATIONSHIP_PRIORITY.BLOCK
          case 'mute':
            return RELATIONSHIP_PRIORITY.MUTE
          default:
            return RELATIONSHIP_PRIORITY.INACTIVE
        }
    }
  }

  closeModal() {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  handleRelationshipUpdate = (vo) => {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      return dispatch(updateRelationship(userId, priority, existing, true))
    }
    return dispatch(updateRelationship(userId, priority, existing))
  };

  isBlockedOrMuted() {
    const { user } = this.props
    const status = user.relationshipPriority
    return status && status === RELATIONSHIP_PRIORITY.BLOCK || status === RELATIONSHIP_PRIORITY.MUTE
  }

  handleBlockUser = () => {
    const { dispatch, previousPath } = this.props
    const { user } = this.props
    const priority = user.relationshipPriority
    this.handleRelationshipUpdate({
      userId: user.id,
      priority: this.getNextPriority(this.props, 'block'),
      existing: priority,
    })
    this.closeModal()
    dispatch(routeActions.replace(previousPath || '/'))
  };

  handleMuteUser = () => {
    const { user } = this.props
    const priority = user.relationshipPriority
    this.handleRelationshipUpdate({
      userId: user.id,
      priority: this.getNextPriority(this.props, 'mute'),
      existing: priority,
    })
    this.closeModal()
  };

  launchBlockMutePrompt = () => {
    const { dispatch, user } = this.props
    const priority = user.relationshipPriority
    dispatch(openModal(
      <BlockMuteDialog
        onBlock={ this.handleBlockUser }
        onMute={ this.handleMuteUser }
        blockIsActive={ priority === RELATIONSHIP_PRIORITY.BLOCK }
        muteIsActive={ priority === RELATIONSHIP_PRIORITY.MUTE }
        username = { user.username }
      />
    , 'asDangerZone'))
  };

  handleLaunchSignUpModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    return dispatch(trackEvent('open-registration-request-follow-button'))
  };

  shouldRenderBlockMute() {
    const { isLoggedIn, showBlockMuteButton, user } = this.props
    const { relationshipPriority } = user
    return isLoggedIn && showBlockMuteButton && relationshipPriority !== RELATIONSHIP_PRIORITY.SELF
  }

  renderBlockMuteButton() {
    const { user } = this.props
    return (
      <BlockMuteButton
        onClick={ this.launchBlockMutePrompt }
        priority={ user.relationshipPriority }
        userId={ user.id }
      />
    )
  }

  render() {
    const { isLoggedIn, user } = this.props
    const callback = this.isBlockedOrMuted() ?
                     (this.launchBlockMutePrompt) :
                     (this.handleRelationshipUpdate)

    return (
      <div className="RelationsGroup" >
        { this.shouldRenderBlockMute() ? this.renderBlockMuteButton() : null }
        <RelationshipButton
          buttonWasClicked={ isLoggedIn ? callback : this.handleLaunchSignUpModal }
          priority={ user.relationshipPriority }
          ref="RelationshipButton"
          userId={ user.id }
        />
        <StarshipButton
          buttonWasClicked={ isLoggedIn ? callback : this.handleLaunchSignUpModal }
          priority={ user.relationshipPriority }
          ref="StarshipButton"
          userId={ user.id }
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.routing.location.pathname,
    previousPath: state.routing.previousPath,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(RelationsGroup)

