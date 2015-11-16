import React from 'react'
import classNames from 'classnames'


export class SVGComponent extends React.Component {
  render() {
    return (
      <svg {...this.props}>
        {this.props.children}
      </svg>
    )
  }
}

SVGComponent.propTypes = {
  children: React.PropTypes.node.isRequired,
}


// -------------------------------------

export class SVGIcon extends React.Component {
  render() {
    return (
      <SVGComponent height="20"
                    width="20"
                    className={classNames(this.props.className, 'SVGIcon')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

SVGIcon.propTypes = {
  className: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
}


// -------------------------------------

export class SVGBox extends React.Component {
  render() {
    return (
      <SVGComponent height="40"
                    width="40"
                    className={classNames(this.props.className, 'SVGBox')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

SVGBox.propTypes = {
  className: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
}

// -------------------------------------

export class SVGShareBox extends React.Component {
  render() {
    return (
      <SVGComponent height="60"
                    width="60"
                    className={classNames(this.props.className, 'SVGShareBox')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

SVGShareBox.propTypes = {
  className: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
}

