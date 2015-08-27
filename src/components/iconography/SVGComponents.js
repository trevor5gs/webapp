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

