import React from 'react'
import { SVGIcon } from './SVGComponents'

// -------------------------------------

export class PlusIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <line x1="4.5" y1="9.5" x2="14.5" y2="9.5"/>
          <line x1="9.5" y1="14.5" x2="9.5" y2="4.5"/>
        </g>
      </SVGIcon>
    )
  }
}

PlusIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

PlusIcon.defaultProps = {
  classListName: 'PlusIcon',
}


export class MinusIcon extends PlusIcon {
}

MinusIcon.defaultProps = {
  classListName: 'MinusIcon',
}


export class MiniPlusIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <line x1="10.5" x2="10.5" y1="6.5" y2="12.5"/>
          <line x1="13.5" x2="7.5" y1="9.5" y2="9.5"/>
        </g>
      </SVGIcon>
    )
  }
}

MiniPlusIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

MiniPlusIcon.defaultProps = {
  classListName: 'MiniPlusIcon',
}

// -------------------------------------

export class MiniCheckIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <polyline points="7,10.4 9.5,13.5 13,7.5" />
        </g>
      </SVGIcon>
    )
  }
}

MiniCheckIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

MiniCheckIcon.defaultProps = {
  classListName: 'MiniCheckIcon',
}

// -------------------------------------

export class ChevronIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <polyline points="6,16 12,10 6,4"/>
        </g>
      </SVGIcon>
    )
  }
}

ChevronIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

ChevronIcon.defaultProps = {
  classListName: 'ChevronIcon',
}

// -------------------------------------

export class EyeIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <path d="M19,9.9c0,0-4,4.9-9,4.9S1,9.9,1,9.9S5,5,10,5 S19,9.9,19,9.9z" />
          <circle cx="10" cy="10" r="5" />
        </g>
        <circle cx="10" cy="10" r="2" />
      </SVGIcon>
    )
  }
}

EyeIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

EyeIcon.defaultProps = {
  classListName: 'EyeIcon',
}

// -------------------------------------

export class BubbleIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <path d="M6.6,12.6l-3.1,3.1 l0-10.3c0-0.7,0.5-1.2,1.2-1.2h10.6c0.7,0,1.2,0.5,1.2,1.2v6c0,0.7-0.5,1.2-1.2,1.2H6.6z" />
        </g>
        <g>
          <path d="M3.5,11.4v-6c0-0.7,0.5-1.2,1.2-1.2 h10.6c0.7,0,1.2,0.5,1.2,1.2v6c0,0.7-0.5,1.2-1.2,1.2H4.7C4,12.6,3.5,12.1,3.5,11.4z" />
          <polygon points=" 6.6,12.6 3.5,15.8 3.5,11.6 " />
        </g>
      </SVGIcon>
    )
  }
}

BubbleIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

BubbleIcon.defaultProps = {
  classListName: 'BubbleIcon',
}

// -------------------------------------

export class HeartIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <path d="M10,7.4c0-1.8,1.5-3.2,3.3-3.2s3.3,1.4,3.3,3.2c0,4.5-6.5,8.4-6.5,8.4S3.5,12,3.5,7.4c0-1.8,1.5-3.2,3.3-3.2S10,5.6,10,7.4z" />
        </g>
      </SVGIcon>
    )
  }
}

HeartIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

HeartIcon.defaultProps = {
  classListName: 'HeartIcon',
}

// -------------------------------------

export class RepostIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <path d="M15.2,6.7H5 c-0.5,0-1,0.4-1,1V10" />
          <path d="M4.8,14.4H15 c0.6,0,1-0.4,1-1v-2.3" />
        </g>
        <g>
          <polyline points="13.3,4 16,6.7 13.2,9.5" />
          <polyline points="6.7,17.1 4,14.4 6.8,11.7" />
        </g>
      </SVGIcon>
    )
  }
}

RepostIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

RepostIcon.defaultProps = {
  classListName: 'RepostIcon',
}

// -------------------------------------

export class ShareIcon extends React.Component {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <polyline points="7.8,7.3 5,7.3 5,17.3 15,17.3 15,7.3 12.2,7.3" />
        </g>
        <g>
          <line x1="10" y1="2" x2="10" y2="12" />
          <polyline points="7.2,4.7 10,2 12.8,4.8" />
        </g>
      </SVGIcon>
    )
  }
}

ShareIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

ShareIcon.defaultProps = {
  classListName: 'ShareIcon',
}

