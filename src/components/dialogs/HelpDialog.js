/* eslint-disable max-len */
import React from 'react'
import { SHORTCUT_KEYS } from '../../constants/gui_types'

const HelpDialog = () =>
  <div className="Dialog HelpDialog">
    <h2>Key Commands</h2>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.SEARCH }</span> Navigate to Search</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.DISCOVER }</span> Navigate to Discover</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.ONBOARDING }</span> Navigate to Onboarding</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.TOGGLE_LAYOUT }</span> Toggle grid mode for main content</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.ESC.toUpperCase() }</span> Close modal or alerts</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.FULLSCREEN }</span> Toggle fullscreen post editor</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.DT_GRID_TOGGLE }</span> Toggle layout grid</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.DT_GRID_CYCLE }</span> Toggle between horizontal and vertical grid</p>
    <p><span className="ShortcutLabel">{ SHORTCUT_KEYS.HELP }</span> Show this help modal</p>
  </div>

export default HelpDialog

