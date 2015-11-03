import React from 'react'
import { SVGBox } from './SVGComponents'

export class ElloMark extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGBox className={classListName}>
        <path d="M0 0h40v40h-40z"/>
        <path d="M20.5 32c-5.5 0-10.2-3.7-11.6-9-.2-.6.2-1.2.8-1.4.6-.2 1.2.2 1.4.8 1.1 4.3 5 7.3 9.4 7.3s8.3-3 9.4-7.3c.2-.6.8-1 1.4-.8.6.2 1 .8.8 1.4-1.3 5.3-6.1 9-11.6 9z"/>
      </SVGBox>
    )
  }
}

ElloMark.defaultProps = {
  classListName: 'ElloMark',
}

ElloMark.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}


export class ElloBoxMark extends ElloMark {
}

ElloBoxMark.defaultProps = {
  classListName: 'ElloBoxMark',
}

export class ElloRainbowMark extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGBox className={classListName}>
        <rect fill="#e31e26" y="0" width="40" height="7" />
        <rect fill="#f78c1f" y="7" width="40" height="7" />
        <rect fill="#fdec0a" y="14" width="40" height="7" />
        <rect fill="#0c8140" y="21" width="40" height="7" />
        <rect fill="#3f5fac" y="28" width="40" height="7" />
        <rect fill="#732a83" y="35" width="40" height="7" />
        <path fill="white" d="M20.5 32c-5.5 0-10.2-3.7-11.6-9-.2-.6.2-1.2.8-1.4.6-.2 1.2.2 1.4.8 1.1 4.3 5 7.3 9.4 7.3s8.3-3 9.4-7.3c.2-.6.8-1 1.4-.8.6.2 1 .8.8 1.4-1.3 5.3-6.1 9-11.6 9z"/>
      </SVGBox>
    )
  }
}

ElloRainbowMark.defaultProps = {
  classListName: 'ElloRainbowMark',
}
ElloRainbowMark.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}


