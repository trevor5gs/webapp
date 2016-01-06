import React, { Component, PropTypes } from 'react'
import { SVGIcon } from '../interface/SVGComponents'
import classNames from 'classnames'

const TreeIcon = () =>
  <SVGIcon className="TreeIcon">
    <g>
      <circle cx="10" cy="10" r="7"/>
    </g>
    <g>
      <polyline points="8.2,6.5 11.8,10 8.2,13.5" />
    </g>
  </SVGIcon>


class TreeButton extends Component {

  constructor(props, context) {
    super(props, context)
    const { isCollapsed } = this.props
    this.state = {
      collapsed: isCollapsed,
    }
  }

  handleChange(...rest) {
    const { onClick } = this.props
    const { collapsed } = this.state
    const newCollapsedState = !collapsed
    this.setState({ collapsed: newCollapsedState })
    if (typeof onClick === 'function') {
      onClick(...rest)
    }
  }

  render() {
    const { children, className } = this.props
    const { collapsed } = this.state
    return (
      <button
        className={classNames(className, 'TreeButton', { isCollapsed: collapsed })}
        onClick={ ::this.handleChange }
      >
        <TreeIcon/>
        {children}
      </button>
    )
  }
}

TreeButton.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  isCollapsed: PropTypes.bool,
  onClick: PropTypes.func,
}

TreeButton.defaultProps = {
  isCollapsed: true,
}

export default TreeButton

