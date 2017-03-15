import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import Editor from '../editor/Editor'
import { ChevronIcon } from '../assets/Icons'

export const Omnibar = ({ avatar, classList, isActive, isFullScreen, onClickCloseOmnibar }) => {
  if (!isActive) {
    return <div className={classNames('Omnibar', { isActive }, classList)} />
  }
  return (
    <div className={classNames('Omnibar', { isActive, isFullScreen }, classList)} >
      <Avatar sources={avatar} />
      <Editor shouldLoadFromState shouldPersist />
      <button className="OmnibarRevealNavbar" onClick={onClickCloseOmnibar}>
        <ChevronIcon />
        Navigation
      </button>
    </div>
  )
}

Omnibar.propTypes = {
  avatar: PropTypes.object,
  classList: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool,
  onClickCloseOmnibar: PropTypes.func.isRequired,
}

Omnibar.defaultProps = {
  avatar: null,
  classList: null,
  isFullScreen: false,
}

export default Omnibar

