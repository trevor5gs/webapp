import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { openModal, closeModal } from '../../actions/modals'
import { flagUser } from '../../actions/user'
import { updateRelationship } from '../../actions/relationships'
import { trackEvent } from '../../actions/tracking'
import BlockMuteDialog from '../dialogs/BlockMuteDialog'
import FlagDialog from '../dialogs/FlagDialog'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import BlockMuteButton from '../relationships/BlockMuteButton'
import RelationshipButton from '../relationships/RelationshipButton'
import StarshipButton from '../relationships/StarshipButton'

class RelationsGroup extends Component {

  static propTypes = {
    classList: PropTypes.string,
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    previousPath: PropTypes.string,
    relationshipPriority: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
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
    const { dispatch, relationshipPriority, user } = this.props
    dispatch(openModal(
      <BlockMuteDialog
        onBlock={this.onConfirmBlockUser}
        onFlag={this.onConfirmFlagUser}
        onMute={this.onConfirmMuteUser}
        blockIsActive={relationshipPriority === RELATIONSHIP_PRIORITY.BLOCK}
        muteIsActive={relationshipPriority === RELATIONSHIP_PRIORITY.MUTE}
        username={user.username}
      />
    , 'asDangerZone'))
  }

  onConfirmBlockUser = () => {
    const { dispatch, previousPath, relationshipPriority } = this.props
    const { user } = this.props
    this.onRelationshipUpdate({
      userId: user.id,
      priority: this.getNextPriority(this.props, 'block'),
      existing: relationshipPriority,
    })
    this.closeModal()
    if (relationshipPriority !== RELATIONSHIP_PRIORITY.BLOCK) {
      dispatch(replace(previousPath || '/'))
    }
  }

  onConfirmMuteUser = () => {
    const { relationshipPriority, user } = this.props
    this.onRelationshipUpdate({
      userId: user.id,
      priority: this.getNextPriority(this.props, 'mute'),
      existing: relationshipPriority,
    })
    this.closeModal()
  }

  onConfirmFlagUser = () => {
    const { deviceSize, dispatch } = this.props
    // close the existing block/mute/flag modal
    this.closeModal()
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onConfirm={this.closeModal}
        onResponse={this.onUserWasFlagged}
      />))
  }

  onUserWasFlagged = ({ flag }) => {
    const { dispatch, user } = this.props
    dispatch(flagUser(user.username, flag))
  }

  getNextPriority(props, btnId) {
    const { relationshipPriority } = props
    switch (relationshipPriority) {
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
    const { relationshipPriority } = this.props
    return relationshipPriority &&
      relationshipPriority === RELATIONSHIP_PRIORITY.BLOCK ||
      relationshipPriority === RELATIONSHIP_PRIORITY.MUTE
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  shouldRenderBlockMute() {
    const { isLoggedIn, showBlockMuteButton, relationshipPriority } = this.props
    return isLoggedIn && showBlockMuteButton && relationshipPriority !== RELATIONSHIP_PRIORITY.SELF
  }

  renderBlockMuteButton() {
    const { relationshipPriority, user } = this.props
    return (
      <BlockMuteButton
        onClick={this.onOpenBlockMutePrompt}
        priority={relationshipPriority}
        userId={user.id}
      />
    )
  }

  render() {
    const { isLoggedIn, relationshipPriority, user, classList } = this.props
    const callback = this.isBlockedOrMuted() ?
                     (this.onOpenBlockMutePrompt) :
                     (this.onRelationshipUpdate)

    return (
      <div className="RelationsGroup" data-priority={relationshipPriority}>
        {this.shouldRenderBlockMute() ? this.renderBlockMuteButton() : null}
        <RelationshipButton
          onClick={isLoggedIn ? callback : this.onOpenSignupModal}
          classList={classList}
          priority={relationshipPriority}
          ref="RelationshipButton"
          userId={user.id}
        />
        <StarshipButton
          onClick={isLoggedIn ? callback : this.onOpenSignupModal}
          classList={classList}
          priority={relationshipPriority}
          ref="StarshipButton"
          userId={user.id}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    deviceSize: state.gui.deviceSize,
    isLoggedIn: state.authentication.isLoggedIn,
    pathname: state.routing.location.pathname,
    previousPath: state.routing.previousPath,
    relationshipPriority: user.relationshipPriority,
    user,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(RelationsGroup)

