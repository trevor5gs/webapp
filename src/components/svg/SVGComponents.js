import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const SVGComponent = ({ children, ...rest }) =>
  <svg { ...rest }>
    {children}
  </svg>

SVGComponent.propTypes = {
  children: PropTypes.node.isRequired,
}


export const SVGIcon = ({ children, className }) =>
  <SVGComponent
    width="20"
    height="20"
    className={classNames(className, 'SVGIcon')}
  >
    {children}
  </SVGComponent>

SVGIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
}


export const SVGBox = ({ children, className }) =>
  <SVGComponent
    width="40"
    height="40"
    className={classNames(className, 'SVGBox')}
  >
    {children}
  </SVGComponent>

SVGBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
}


export const SVGBoxMedium = ({ children, className }) =>
  <SVGComponent
    width="60"
    height="60"
    className={classNames(className, 'SVGBox')}
  >
    {children}
  </SVGComponent>

SVGBoxMedium.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
}

