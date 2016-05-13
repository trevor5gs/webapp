import React, { PropTypes } from 'react'
import Hint from '../hints/Hint'
import { DotsIcon } from '../relationships/RelationshipIcons'

const BlockMuteButton = ({ onClick }) =>
  <button
    className="BlockMuteButton"
    onClick={onClick}
  >
    <DotsIcon />
    <Hint>Block or Mute</Hint>
  </button>

BlockMuteButton.propTypes = {
  onClick: PropTypes.func,
}

export default BlockMuteButton

