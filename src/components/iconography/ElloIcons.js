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
        <rect fill="#E31E26" y="0" width="40" height="7" />
        <rect fill="#F78C1F" y="7" width="40" height="7" />
        <rect fill="#FDEC0A" y="14" width="40" height="7" />
        <rect fill="#0C8140" y="21" width="40" height="7" />
        <rect fill="#3F5FAC" y="28" width="40" height="7" />
        <rect fill="#732A83" y="35" width="40" height="7" />
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


