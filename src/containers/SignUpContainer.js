import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual, pick, sample } from 'lodash'
import { trackEvent } from '../actions/tracking'
import { SignUp } from '../components/views/SignUp'

function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  const pickProps = ['coverDPI', 'coverOffset']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare) || !isEqual(thisState, nextState)
}

function mapStateToProps(state) {
  const { gui, promotions } = state
  return {
    coverDPI: gui.coverDPI,
    coverOffset: gui.coverOffset,
    promotions: promotions.authentication,
  }
}

class SignUpContainer extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    promotions: PropTypes.array.isRequired,
  }

  componentWillMount() {
    const { promotions } = this.props
    this.state = { promotion: sample(promotions) }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldContainerUpdate(this.props, nextProps, this.state, nextState)
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { coverDPI, coverOffset } = this.props
    const { promotion } = this.state
    const onClickTrackCredits = this.onClickTrackCredits
    const props = { coverDPI, coverOffset, onClickTrackCredits, promotion }
    return <SignUp {...props} />
  }
}

export default connect(mapStateToProps)(SignUpContainer)

