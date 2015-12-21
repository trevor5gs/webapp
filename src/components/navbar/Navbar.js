import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushState } from 'redux-router'
import classNames from 'classnames'
import * as ACTION_TYPES from '../../constants/action_types'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { openModal, closeModal } from '../../actions/modals'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'
import HelpDialog from '../dialogs/HelpDialog'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import NavbarLabel from '../navbar/NavbarLabel'
import NavbarLink from '../navbar/NavbarLink'
import NavbarMark from '../navbar/NavbarMark'
import NavbarMorePostsButton from '../navbar/NavbarMorePostsButton'
import NavbarOmniButton from '../navbar/NavbarOmniButton'
import NavbarProfile from '../navbar/NavbarProfile'
import { BoltIcon, CircleIcon, SearchIcon, SparklesIcon, StarIcon } from '../navbar/NavbarIcons'
import Mousetrap from '../../vendor/mousetrap'

class Navbar extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    json: PropTypes.object.isRequired,
    modal: PropTypes.any,
    profile: PropTypes.object,
    router: PropTypes.object.isRequired,
    shortcuts: PropTypes.object.isRequired,
  }

  static defaultProps = {
    shortcuts: {
      [SHORTCUT_KEYS.SEARCH]: '/search',
      [SHORTCUT_KEYS.DISCOVER]: '/discover',
      [SHORTCUT_KEYS.FOLLOWING]: '/following',
      [SHORTCUT_KEYS.ONBOARDING]: '/onboarding/communities',
    },
  }

  constructor(props, context) {
    super(props, context)
    this.scrollYAtDirectionChange = null
    this.state = {
      asFixed: false,
      asHidden: false,
      asLocked: false,
      skipTransition: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    Mousetrap.bind(Object.keys(this.props.shortcuts), (event, shortcut) => {
      dispatch(pushState(window.history.state, this.props.shortcuts[shortcut]))
    })

    Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
      const { modal } = this.props
      if (modal.payload) {
        return dispatch(closeModal())
      }
      return dispatch(openModal(<HelpDialog/>))
    })

    // TODO: probably need to handle this a bit better
    Mousetrap.bind(SHORTCUT_KEYS.LOGOUT, () => {
      dispatch({ type: ACTION_TYPES.AUTHENTICATION.LOGOUT })
      dispatch(pushState(window.history.state, '/'))
    })

    Mousetrap.bind(SHORTCUT_KEYS.TOGGLE_LAYOUT, () => {
      const { json, router } = this.props
      let result = null
      if (json.pages) {
        result = json.pages[router.location.pathname]
      }
      if (result && result.mode) {
        const newMode = result.mode === 'grid' ? 'list' : 'grid'
        dispatch({
          type: ACTION_TYPES.SET_LAYOUT_MODE,
          payload: { mode: newMode },
        })
      }
    })
    addResizeObject(this)
    addScrollObject(this)
  }

  componentWillReceiveProps(nextProps) {
    const { router } = nextProps
    const pathnames = router.location.pathname.split('/').slice(1)
    const whitelist = ['', 'discover', 'following', 'starred', 'notifications', 'search', 'invitations', 'onboarding', 'staff', 'find']
    const isWhitelisted = (whitelist.indexOf(pathnames[0]) >= 0 || pathnames[1] === 'post')
    this.setState({ asLocked: !isWhitelisted })
  }

  // componentDidUpdate() {
  //   if (this.state.asLocked) {
  //     window.scrollTo(0, this.state.offset - 120)
  //   }
  // }

  componentWillUnmount() {
    Mousetrap.unbind(Object.keys(this.props.shortcuts))
    Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    Mousetrap.unbind(SHORTCUT_KEYS.TOGGLE_LAYOUT)
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onResize(resizeProperties) {
    const { coverOffset } = resizeProperties
    this.setState({ offset: coverOffset - 120 })
  }

  onScrollTop() {
    if (this.state.asFixed) {
      this.setState({ asFixed: false, asHidden: false, skipTransition: false })
    }
  }

  onScrollDirectionChange(scrollProperties) {
    const { scrollY } = scrollProperties
    const { offset } = this.state

    if (scrollY >= offset) {
      this.scrollYAtDirectionChange = scrollY
    }
  }

  onScroll(scrollProperties) {
    const { scrollY, scrollDirection } = scrollProperties
    const { offset } = this.state

    // Going from absolute to fixed positioning
    if (scrollY >= offset && !this.state.asFixed) {
      this.setState({ asFixed: true, asHidden: true, skipTransition: true })
    }

    // Scroll just changed directions so it's about to either be shown or hidden
    if (scrollY >= offset && this.scrollYAtDirectionChange) {
      const distance = Math.abs(scrollY - this.scrollYAtDirectionChange)
      const delay = scrollDirection === 'down' ? 20 : 80

      if (distance >= delay) {
        this.setState({ asHidden: scrollDirection === 'down', skipTransition: false })
        this.scrollYAtDirectionChange = null
      }
    }
  }

  omniButtonWasClicked() {
  }

  searchWasClicked() {
    const { dispatch } = this.props
    dispatch({ type: ACTION_TYPES.SEARCH.CLEAR })
  }

  loadMorePostsWasClicked() {
    const { dispatch } = this.props
    dispatch({
      type: ACTION_TYPES.ADD_NEW_IDS_TO_RESULT,
    })
  }

  logInWasClicked(e) {
    e.preventDefault()
    document.location.href = ENV.REDIRECT_URI + e.target.pathname
  }

  launchSignUpModal(e) {
    const { dispatch } = this.props
    e.preventDefault()
    return dispatch(openModal(<RegistrationRequestDialog />))
  }

  renderLoggedInNavbar(klassNames, hasLoadMoreButton, pathname) {
    const { profile } = this.props
    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        <NavbarOmniButton callback={::this.omniButtonWasClicked} />
        { hasLoadMoreButton ? <NavbarMorePostsButton callback={::this.loadMorePostsWasClicked} /> : null }
        <div className="NavbarLinks">
          <NavbarLink to="/discover" label="Discover" modifiers="LabelOnly" pathname={pathname} icon={ <SparklesIcon/> } />
          <NavbarLink to="/following" label="Following" modifiers="LabelOnly" pathname={pathname} icon={ <CircleIcon/> } />
          <NavbarLink to="/starred" label="Starred" modifiers="" pathname={pathname} icon={ <StarIcon/> } />
          <NavbarLink to="/notifications" label="Notifications" modifiers="IconOnly" pathname={pathname} icon={ <BoltIcon/> } />
          <NavbarLink to="/search" label="Search" modifiers="IconOnly" pathname={pathname} onClick={::this.searchWasClicked} icon={ <SearchIcon/> } />
        </div>
        <NavbarProfile { ...profile.payload } />
      </nav>
    )
  }

  renderLoggedOutNavbar(klassNames, hasLoadMoreButton, pathname) {
    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        <NavbarLabel />
        { hasLoadMoreButton ? <NavbarMorePostsButton callback={::this.loadMorePostsWasClicked} /> : null }
        <div className="NavbarLinks">
          <NavbarLink to="/explore" label="Discover" modifiers="LabelOnly" pathname={pathname} icon={ <SparklesIcon/> } />
          <NavbarLink to="/find" label="Search" modifiers="IconOnly" pathname={pathname} onClick={::this.searchWasClicked} icon={ <SearchIcon/> } />
          <NavbarLink to="/enter" label="Log in" modifiers="LabelOnly" pathname={pathname} onClick={::this.logInWasClicked}/>
          <NavbarLink to="/signup" label="Sign up" modifiers="LabelOnly" pathname={pathname} onClick={::this.launchSignUpModal} />
        </div>
      </nav>
    )
  }

  render() {
    const { isLoggedIn, json, router } = this.props
    const klassNames = classNames(
      'Navbar',
      { asLocked: this.state.asLocked },
      { asFixed: this.state.asFixed },
      { asHidden: this.state.asHidden },
      { skipTransition: this.state.skipTransition },
    )
    const pathname = router && router.location ? router.location.pathname : ''
    const result = json.pages && router ? json.pages[router.location.pathname] : null
    const hasLoadMoreButton = result && result.newIds

    return isLoggedIn ? this.renderLoggedInNavbar(klassNames, hasLoadMoreButton, pathname) : this.renderLoggedOutNavbar(klassNames, hasLoadMoreButton, pathname)
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    json: state.json,
    modal: state.modal,
    profile: state.profile,
    router: state.router,
  }
}

export default connect(mapStateToProps)(Navbar)

