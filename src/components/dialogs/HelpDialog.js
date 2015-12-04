import React from 'react'
import { SHORTCUT_KEYS } from '../../constants/gui_types'

class HelpDialog extends React.Component {
  render() {
    return (
      <div className="Dialog HelpDialog">
        <h2>Key Commands</h2>
        <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.SEARCH }</span> Navigate to Search</p>
        <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.DISCOVER }</span> Navigate to Discover</p>
        <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.ONBOARDING }</span> Navigate to Onboarding</p>
        <p><span className="ShortcutLabel" style={{ textIndent: 15 }}>{ SHORTCUT_KEYS.HELP }</span> Show this help modal</p>
        <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.ESC.toUpperCase() }</span> Close modal or alerts</p>
      </div>
    )
  }
}

export default HelpDialog

