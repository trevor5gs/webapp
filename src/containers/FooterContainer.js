// @flow
import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { isIOS, scrollToPosition } from '../lib/jello'
import { FOOTER_LINKS as links } from '../constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsGridMode, selectIsLayoutToolHidden, selectIsMobile } from '../selectors/gui'
import { selectAvailability } from '../selectors/profile'
import { selectPathname } from '../selectors/routing'
import { selectStreamType } from '../selectors/stream'
import { trackEvent } from '../actions/analytics'
import { checkAvailability } from '../actions/profile'
import { getEmailStateFromClient, getEmailStateFromServer } from '../components/forms/Validators'
import { Footer } from '../components/footer/FooterRenderables'
import type { Availability } from '../types/flowtypes'

let emailValue = ''

type Props = {
  availability: Availability,
  dispatch: () => void,
  formActionPath: string,
  isGridMode: boolean,
  isLayoutToolHidden: boolean,
  isLoggedIn: boolean,
  isMobile: boolean,
  isPaginatoring: boolean,
  pathname: string,
}

type State = {
  emailStatus: string,
  formMessage: string,
  formStatus: string,
  isFormDisabled: boolean,
  isFormFocused: boolean,
}

function mapStateToProps(state, props) {
  const streamType = selectStreamType(state)
  return {
    availability: selectAvailability(state),
    formActionPath: checkAvailability().payload.endpoint.path,
    isGridMode: selectIsGridMode(state),
    isLayoutToolHidden: selectIsLayoutToolHidden(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isPaginatoring: streamType === LOAD_NEXT_CONTENT_REQUEST,
    pathname: selectPathname(state),
  }
}

class FooterContainer extends PureComponent {
  props: Props
  state: State

  static childContextTypes = {
    onClickScrollToTop: PropTypes.func.isRequired,
    onClickToggleLayoutMode: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
      onBlur: !isLoggedIn ? this.onBlur : null,
      onChange: !isLoggedIn ? this.onChange : null,
      onFocus: !isLoggedIn ? this.onFocus : null,
      onSubmit: !isLoggedIn ? this.onSubmit : null,
    }
  }

  componentWillMount() {
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      formMessage: '',
      formStatus: STATUS.INDETERMINATE,
      isFormDisabled: true,
      isFormFocused: false,
    }
    emailValue = ''
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (!availability) { return }
    if (availability.has('email')) {
      this.validateEmailResponse(availability)
    }
  }

  onChange = ({ FooterEmailInput: email }) => {
    emailValue = email
    const { emailStatus, isFormDisabled, formStatus } = this.state
    const currentStatus = emailStatus
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
    if (formStatus !== STATUS.INDETERMINATE) {
      this.setState({ formStatus: STATUS.INDETERMINATE, formMessage: '' })
    }
    if (clientState.status === STATUS.SUCCESS && isFormDisabled) {
      this.setState({ emailStatus: STATUS.SUCCESS, isFormDisabled: false })
      return
    }
    if (currentStatus !== clientState.status) {
      this.setState({
        emailStatus: clientState.status,
        isFormDisabled: true,
      })
    }
  }

  // Only happens on iOS
  onBlur = () => {
    this.setState({ isFormFocused: false })
    if (isIOS() && document && document.body) {
      document.body.classList.remove('isModalActive')
    }
  }

  // Only happens on iOS
  onFocus = () => {
    if (isIOS() && document && document.body) {
      document.body.classList.add('isModalActive')
    }
    this.setState({ isFormFocused: true })
  }

  onClickScrollToTop = () => {
    scrollToPosition(0, 0)
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  onSubmit = (e: Event) => {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(checkAvailability({ email: emailValue, is_signup: true }))
  }

  validateEmailResponse(availability) {
    const { dispatch, pathname } = this.props
    const { formStatus } = this.state
    const newState = getEmailStateFromServer({ availability, currentStatus: formStatus })
    if (newState.status === STATUS.SUCCESS) {
      dispatch(trackEvent('Newsletter_signup_footer', { pathname }))
      this.setState({ formStatus: STATUS.SUCCESS, formMessage: 'Subscribed. See you tomorrow' })
      setTimeout(() => {
        const el = document.getElementById('FooterEmailInput')
        // $FlowFixMe
        if (el) { el.value = '' }
        this.setState({ formStatus: STATUS.INDETERMINATE, formMessage: '' })
      }, 1666)
    } else {
      this.setState({ formStatus: newState.status, formMessage: newState.message })
    }
  }

  render() {
    const props = {
      formActionPath: this.props.formActionPath,
      formMessage: this.state.formMessage,
      formStatus: this.state.formStatus,
      isFormDisabled: this.state.isFormDisabled,
      isFormFocused: this.state.isFormFocused,
      isGridMode: this.props.isGridMode,
      isLayoutToolHidden: this.props.isLayoutToolHidden,
      isLoggedIn: this.props.isLoggedIn,
      isMobile: this.props.isMobile,
      isPaginatoring: this.props.isPaginatoring,
      links,
    }
    return <Footer {...props} />
  }
}

export default connect(mapStateToProps)(FooterContainer)

