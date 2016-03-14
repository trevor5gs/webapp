import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
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
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    previousPath: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      relationshipPriority: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    showBlockMuteButton: false,
  }

  onRelationshipUpdate = (vo) => {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      dispatch(updateRelationship(userId, priority, existing, true))
      return
    }
    dispatch(updateRelationship(userId, priority, existing))
  }

  onOpenSignupModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    dispatch(trackEvent('open-registration-request-follow-button'))
  }

  onOpenBlockMutePrompt = () => {
    const { dispatch, user } = this.props
    const priority = user.relationshipPriority
    dispatch(openModal(
      <BlockMuteDialog
        onBlock={ this.onConfirmBlockUser }
        onMute={ this.onConfirmMuteUser }
        blockIsActive={ priority === RELATIONSHIP_PRIORITY.BLOCK }
        muteIsActive={ priority === RELATIONSHIP_PRIORITY.MUTE }
        username = { user.username }
      />
    , 'asDangerZone'))
  }

  onConfirmBlockUser = () => {
    const { dispatch, previousPath } = this.props
    const { user } = this.props
    const priority = user.relationshipPriority
    this.onRelationshipUpdate({
      userId: user.id,
      priority: this.getNextPriority(this.props, 'block'),
      existing: priority,
    })
    this.closeModal()
    // TODO: this should only go back if you are blocking
    // on a profile page, if the previous page was search
    // the terms should be restored in the url..
    if (priority !== RELATIONSHIP_PRIORITY.BLOCK) {
      dispatch(replace(previousPath || '/'))
    }
  }

  onConfirmMuteUser = () => {
    const { user } = this.props
    const priority = user.relationshipPriority
    this.onRelationshipUpdate({
      userId: user.id,
      priority: this.getNextPriority(this.props, 'mute'),
      existing: priority,
    })
    this.closeModal()
  }

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

  isBlockedOrMuted() {
    const { user } = this.props
    const status = user.relationshipPriority
    return status && status === RELATIONSHIP_PRIORITY.BLOCK || status === RELATIONSHIP_PRIORITY.MUTE
  }

  closeModal() {
    const { dispatch } = this.props
    dispatch(closeModal())
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
        onClick={ this.onOpenBlockMutePrompt }
        priority={ user.relationshipPriority }
        userId={ user.id }
      />
    )
  }

  render() {
    const { isLoggedIn, user, classList } = this.props
    const callback = this.isBlockedOrMuted() ?
                     (this.onOpenBlockMutePrompt) :
                     (this.onRelationshipUpdate)

    return (
      <div className="RelationsGroup" data-priority={ user.relationshipPriority }>
        { this.shouldRenderBlockMute() ? this.renderBlockMuteButton() : null }
        <RelationshipButton
          onClick={ isLoggedIn ? callback : this.onOpenSignupModal }
          classList={ classList }
          priority={ user.relationshipPriority }
          ref="RelationshipButton"
          userId={ user.id }
        />
        <StarshipButton
          onClick={ isLoggedIn ? callback : this.onOpenSignupModal }
          classList={ classList }
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

