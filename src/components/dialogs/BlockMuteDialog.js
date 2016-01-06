import React, { PropTypes } from 'react'
import classNames from 'classnames'

const BlockMuteDialog = ({ onBlock, onMute, blockIsActive = false, muteIsActive = false }) => {
  const blockButtonClasses = classNames({ isActive: blockIsActive }, 'BlockMuteDialogButton')
  const muteButtonClasses = classNames({ isActive: muteIsActive }, 'BlockMuteDialogButton')
  const blockButtonText = blockIsActive ? 'Unblock' : 'Block'
  const muteButtonText = muteIsActive ? 'Unmute' : 'Mute'

  return (
    <div className="Dialog BlockMuteDialog">
      <h2>Would you like to block or mute XXX</h2>
      <div className="BlockMuteDialogBody">
        <div className="BlockMuteDialogColumn">
          <button
            className={ blockButtonClasses }
            onClick={ onBlock }
          >
            { blockButtonText }
          </button>
          <p>
            Blocking mutes a user, and disables them from viewing your profile
            and posts. When blocking, we recommend setting your account to
            "Non-Public" to disable your profile from being viewed by people
            outside of the Ello network.
          </p>
        </div>
        <div className="BlockMuteDialogColumn">
          <button
            className={ muteButtonClasses }
            onClick={ onMute }
          >
            { muteButtonText }
          </button>
          <p>
            Muting prevents further email notifications from a user and removes
            their past activity from your feed. The user is still able to
            follow you and can still comment on your posts, but you will not
            receive any notifications.
          </p>
        </div>
      </div>
    </div>
  )
}

BlockMuteDialog.propTypes = {
  onBlock: PropTypes.func,
  onMute: PropTypes.func,
}

export default BlockMuteDialog

  // launchBlockMutePrompt() {
  //   const { dispatch } = this.props
  //   dispatch(openModal(
  //     <BlockMuteDialog
  //       onBlock={ ::this.closeModal }
  //       onMute={ ::this.closeModal }
  //     />
  //   , 'asDangerZone'))
  // }
  // <button onClick={::this.launchBlockMutePrompt}>Launch Block / Mute Modal</button>

