import React from 'react'
import { SVGBox } from './SVGComponents'

export class ElloMark {
  classList() {
    return 'ElloMark'
  }
  render() {
    return (
      <SVGBox className={this.classList()}>
        <path d="M0 0h60v60h-60z"/>
        <path d="M30 48c-8.2 0-15.4-5.6-17.4-13.5-.2-.9.3-1.9 1.2-2.1.9-.2 1.9.3 2.1 1.2 1.7 6.4 7.5 10.9 14.1 10.9s12.4-4.5 14.1-10.9c.2-.9 1.2-1.5 2.1-1.2.9.2 1.5 1.2 1.2 2.1-2 7.9-9.2 13.5-17.4 13.5z"/>
      </SVGBox>
    )
  }

}


export class ElloBoxMark extends ElloMark {
  classList() { return 'ElloBoxMark' }
}

