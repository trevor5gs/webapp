import React, { PropTypes } from 'react'
import Emoji from '../assets/Emoji'

const Beacon = ({ children, emoji, onDismiss }) =>
  <div className="Beacon">
    <Emoji name={emoji} size={ 32 } />
    <h2 className="BeaconHeading">
      { children }
    </h2>
    { onDismiss ?
      <button className="BeaconButton" onClick={ onDismiss }>
        <span>Close</span>
      </button> :
      null
     }
  </div>

Beacon.propTypes = {
  children: PropTypes.node.isRequired,
  emoji: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
}

export default Beacon

