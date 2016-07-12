import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { isNil, random, isEqual } from 'lodash'
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
    userlist: PropTypes.array.isRequired,
  }

  static defaultProps = {
    coverDPI: 'xhdpi',
  }

  componentWillMount() {
    const { userlist } = this.props
    const index = random(0, userlist.length - 1)
    this.state = {
      featuredUser: userlist[index],
      status: STATUS.REQUEST,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const creditsClickAction = null
    const userlist = null
    const thisCompare = { ...this.props, ...this.state, creditsClickAction, userlist }
    const nextCompare = { ...nextProps, ...nextState, creditsClickAction, userlist }
    return !isEqual(thisCompare, nextCompare)
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  getCoverSource() {
    const { coverDPI } = this.props
    const { featuredUser } = this.state
    if (!featuredUser) { return null }
    const { coverImage } = featuredUser
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
    const { featuredUser, status } = this.state
    const { creditsClickAction, isLoggedIn } = this.props
    if (!featuredUser) { return null }
    const { caption, cta } = featuredUser
    if (isNil(featuredUser)) {
      return null
    }
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
        <Credits onClick={creditsClickAction} user={featuredUser} />
      </div>
    )
  }
}

