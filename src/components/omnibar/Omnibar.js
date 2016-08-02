import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import Editor from '../editor/Editor'
import { SVGIcon } from '../svg/SVGComponents'

const ChevronIcon = () =>
  <SVGIcon className="ChevronIcon">
    <g>
      <polyline points="6,16 12,10 6,4" />
    </g>
  </SVGIcon>


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
  avatar: PropTypes.shape({}),
  classList: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool,
  onClickCloseOmnibar: PropTypes.func,
}

