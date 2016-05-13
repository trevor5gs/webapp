import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { random } from 'lodash'
import Credits from '../assets/Credits'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

class Promotion extends Component {

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

  componentDidMount() {
    if (this.state.status === STATUS.REQUEST) {
      this.createLoader()
    }
  }

  componentWillUnmount() {
    this.disposeLoader()
  }

  onLoadSuccess = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.FAILURE })
  }

  getCoverSource() {
    const { coverDPI } = this.props
    const { featuredUser } = this.state
    if (!featuredUser) { return null }
    const { coverImage } = featuredUser
    return coverImage[coverDPI].url
  }

  createLoader() {
    const src = this.getCoverSource()
    this.disposeLoader()
    if (src) {
      this.img = new Image()
      this.img.onload = this.onLoadSuccess
      this.img.onerror = this.onLoadFailure
      this.img.src = src
    }
  }

  disposeLoader() {
    if (this.img) {
      this.img.onload = null
      this.img.onerror = null
      this.img = null
    }
  }

  render() {
    const { featuredUser, status } = this.state
    const { creditsClickAction, isLoggedIn } = this.props
    if (!featuredUser) { return null }
    const { caption } = featuredUser
    const src = this.getCoverSource()
    const klassNames = classNames('Promotion', status)
    const style = src ? { backgroundImage: `url(${src})` } : null

    return (
      <div className={klassNames}>
        <figure className="PromotionImage" style={ style } />
        <div className="PromotionCaption">
          { caption }
          { isLoggedIn ? null : <Link to="https://ello.co/signup">Sign Up</Link> }
        </div>
        <Credits onClick={ creditsClickAction } user={ featuredUser } />
      </div>
    )
  }
}

export default Promotion

