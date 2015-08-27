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


export class SVGIcon {
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


export class SVGBox {
  render() {
    return (
      <SVGComponent height="60"
                    width="60"
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

