import React, { PropTypes, PureComponent } from 'react'
import classNames from 'classnames'
import { ChevronCircleIcon } from '../assets/Icons'


class TreeButton extends PureComponent {

  static propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    isCollapsed: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    isCollapsed: true,
    onClick: null,
  }

  componentWillMount() {
    const { isCollapsed } = this.props
    this.state = {
      collapsed: isCollapsed,
    }
  }

  onClickTreeButton = (...rest) => {
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
        onClick={this.onClickTreeButton}
      >
        <ChevronCircleIcon />
        {children}
      </button>
    )
  }
}

export default TreeButton

