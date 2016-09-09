import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import Credits from '../assets/Credits'
import ImageAsset from '../assets/ImageAsset'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export function getSource(props) {
  const { coverDPI, promotion } = props
  if (!promotion) { return null }
  const { coverImage } = promotion
  return coverImage[coverDPI].url
}

export default class Promotion extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    onClickTrackCredits: PropTypes.func,
    promotion: PropTypes.object,
  }

  static defaultProps = {
    coverDPI: 'xhdpi',
  }

  componentWillMount() {
    this.state = { status: STATUS.REQUEST }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  renderCallToAction(isLoggedIn, cta) {
    if (cta) {
      return <a href={cta.href}>{cta.caption}</a>
    } else if (!isLoggedIn) {
      return <Link to="https://ello.co/signup">Sign Up</Link>
    }
    return null
  }

  render() {
    const { status } = this.state
    const { isLoggedIn, onClickTrackCredits, promotion } = this.props
    if (!promotion) { return <div className="Promotion isRequesting" /> }
    const { caption, cta } = promotion
    return (
      <div className={classNames('Promotion', status)}>
        <ImageAsset
          className="PromotionImage"
          isBackgroundImage
          onLoadFailure={this.onLoadFailure}
          onLoadSuccess={this.onLoadSuccess}
          src={getSource(this.props)}
        />
        <div className="PromotionCaption">
          <h1>{caption}</h1>
          {this.renderCallToAction(isLoggedIn, cta)}
        </div>
        <Credits onClick={onClickTrackCredits} user={promotion} />
      </div>
    )
  }
}

