/* eslint-disable max-len */
import React from 'react'
import { SHORTCUT_KEYS } from '../../constants/application_types'

const HelpDialog = () =>
  <div className="Dialog HelpDialog">
    <h2>Key Commands</h2>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.DISCOVER}</span> Navigate to discover</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.SEARCH}</span> Navigate to search</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.FOLLOWING}</span> Navigate to following</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.STARRED}</span> Navigate to starred</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.NOTIFICATIONS}</span> View notifications</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.TOGGLE_LAYOUT}</span> Toggle grid mode for main content</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.OMNIBAR}</span> Focus post editor</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.ESC.toUpperCase()}</span> Close modal or alerts</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.FULLSCREEN}</span> Toggle fullscreen within a post editor</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.DT_GRID_TOGGLE}</span> Toggle layout grid</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.DT_GRID_CYCLE}</span> Toggle between horizontal and vertical grid</p>
    <p><span className="ShortcutLabel monospace">{SHORTCUT_KEYS.HELP}</span> Show this help modal</p>
  </div>

export default HelpDialog

