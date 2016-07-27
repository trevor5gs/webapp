import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { isEqual } from 'lodash'
import Credits from '../assets/Credits'
import ImageAsset from '../assets/ImageAsset'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export default class Promotion extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    creditsClickAction: PropTypes.func,
    isLoggedIn: PropTypes.bool.isRequired,
    promotion: PropTypes.object,
  }

  static defaultProps = {
    coverDPI: 'xhdpi',
  }

  componentWillMount() {
    this.state = { status: STATUS.REQUEST }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisCompare = { ...this.props, ...this.state }
    const nextCompare = { ...nextProps, ...nextState }
    return !isEqual(thisCompare, nextCompare)
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  getCoverSource() {
    const { coverDPI, promotion } = this.props
    if (!promotion) { return null }
    const { coverImage } = promotion
    return coverImage[coverDPI].url
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
    const { creditsClickAction, isLoggedIn, promotion } = this.props
    if (!promotion) { return <div className="Promotion isRequesting" /> }
    const { caption, cta } = promotion
    return (
      <div className={classNames('Promotion', status)}>
        <ImageAsset
          className="PromotionImage"
          isBackgroundImage
          onLoadFailure={this.onLoadFailure}
          onLoadSuccess={this.onLoadSuccess}
          src={this.getCoverSource()}
        />
        <div className="PromotionCaption">
          <h1>{caption}</h1>
          {this.renderCallToAction(isLoggedIn, cta)}
        </div>
        <Credits onClick={creditsClickAction} user={promotion} />
      </div>
    )
  }
}

