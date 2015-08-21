import React from 'react'


function getClassNames(props, defaultIconName = 'SVGIcon') {
  const { className } = props
  return className ? `${defaultIconName} ${className}` : defaultIconName
}


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
                    className={getClassNames(this.props)}>
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
                    className={getClassNames(this.props, 'SVGBox')}>
        {this.props.children}
      </SVGComponent>
    )
  }
}

