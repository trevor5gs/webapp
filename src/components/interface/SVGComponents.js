import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export class SVGComponent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }
  render() {
    return (
      <svg {...this.props}>
        {this.props.children}
      </svg>
    )
  }
}

export class SVGIcon extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }
  render() {
    return (
      <SVGComponent width="20"
                    height="20"
                    className={classNames(this.props.className, 'SVGIcon')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

export class SVGBox extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }
  render() {
    return (
      <SVGComponent width="40"
                    height="40"
                    className={classNames(this.props.className, 'SVGBox')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

export class SVGBoxMedium extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }
  render() {
    return (
      <SVGComponent width="60"
                    height="60"
                    className={classNames(this.props.className, 'SVGBox')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

