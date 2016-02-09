import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import classNames from 'classnames'
import * as ACTION_TYPES from '../../constants/action_types'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { openModal, closeModal } from '../../actions/modals'
import { openOmnibar } from '../../actions/omnibar'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'
import Editor from '../editor/Editor'
import HelpDialog from '../dialogs/HelpDialog'
import NavbarLabel from '../navbar/NavbarLabel'
import NavbarLink from '../navbar/NavbarLink'
import NavbarMark from '../navbar/NavbarMark'
import NavbarMorePostsButton from '../navbar/NavbarMorePostsButton'
import NavbarOmniButton from '../navbar/NavbarOmniButton'
import NavbarProfile from '../navbar/NavbarProfile'
import { BoltIcon, CircleIcon, SearchIcon, SparklesIcon, StarIcon } from '../navbar/NavbarIcons'
import Mousetrap from '../../vendor/mousetrap'

const whitelist = [
  '',
  'discover',
  'explore',
  'find',
  'following',
  'invitations',
  'notifications',
  'onboarding',
  'search',
  'staff',
  'starred',
]

class Navbar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    json: PropTypes.object.isRequired,
    modalIsActive: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    profile: PropTypes.object,
    shortcuts: PropTypes.object.isRequired,
  };

  static defaultProps = {
    shortcuts: {
      [SHORTCUT_KEYS.SEARCH]: '/search',
      [SHORTCUT_KEYS.DISCOVER]: '/discover',
      [SHORTCUT_KEYS.FOLLOWING]: '/following',
      [SHORTCUT_KEYS.ONBOARDING]: '/onboarding/communities',
    },
  };

  componentWillMount() {
    const { pathname } = this.props
    const pathnames = pathname.split('/').slice(1)
    const isBlacklisted = !(whitelist.indexOf(pathnames[0]) >= 0)
    this.state = {
      asFixed: isBlacklisted,
      asHidden: false,
      asLocked: isBlacklisted,
      skipTransition: false,
    }
    this.currentPath = null
    this.scrollYAtDirectionChange = null
  }

  componentDidMount() {
    const { dispatch, isLoggedIn } = this.props

    if (isLoggedIn) {
      Mousetrap.bind(Object.keys(this.props.shortcuts), (event, shortcut) => {
        dispatch(routeActions.push(this.props.shortcuts[shortcut]))
      })

      Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
        const { modalIsActive } = this.props
        if (modalIsActive) {
          return dispatch(closeModal())
        }
        return dispatch(openModal(<HelpDialog/>))
      })
    }

    Mousetrap.bind(SHORTCUT_KEYS.TOGGLE_LAYOUT, () => {
      const { json, pathname } = this.props
      let result = null
      if (json.pages) {
        result = json.pages[pathname]
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
    const { pathname } = nextProps
    const pathnames = pathname.split('/').slice(1)
    const isWhitelisted = (whitelist.indexOf(pathnames[0]) >= 0 || pathnames[1] === 'post')
    const isPageChangeUpdate = pathnames[0] !== this.currentPath
    if (isPageChangeUpdate) {
      this.currentPath = pathnames[0]
      this.setState({
        asFixed: !isWhitelisted,
        asHidden: false,
        asLocked: !isWhitelisted,
        isPageChangeUpdate: true,
        skipTransition: false,
      })
    } else {
      this.setState({ asLocked: !isWhitelisted, isPageChangeUpdate: false })
    }
  }

  // TODO: This may need some tweeks once we get a little more intelligent
  // around the scroll to calls utilizing history
  //
  // @mkitt would like to kick this thing extremely hard.
  componentDidUpdate() {
    // if (typeof window === 'undefined') {
    //   return
    // }
    // const { asLocked, isPageChangeUpdate, offset } = this.state
    // if (isPageChangeUpdate && asLocked) {
    //   window.scrollTo(0, offset - 120)
    // }
  }

  componentWillUnmount() {
    const { isLoggedIn, shortcuts } = this.props
    if (isLoggedIn) {
      Mousetrap.unbind(Object.keys(shortcuts))
      Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    }
    Mousetrap.unbind(SHORTCUT_KEYS.TOGGLE_LAYOUT)
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onResize(resizeProperties) {
    const { coverOffset } = resizeProperties
    this.setState({ offset: coverOffset - 80 })
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

  // TODO: probably need to handle this a bit better
  onLogOut = () => {
    const { dispatch } = this.props
    dispatch({ type: ACTION_TYPES.AUTHENTICATION.LOGOUT })
    dispatch(routeActions.push('/'))
  };

  omniButtonWasClicked = () => {
    const { dispatch } = this.props
    dispatch(openOmnibar(<Editor/>))
    window.scrollTo(0, 0)
  };

  loadMorePostsWasClicked = () => {
    const { dispatch } = this.props
    dispatch({
      type: ACTION_TYPES.ADD_NEW_IDS_TO_RESULT,
    })
  };

  logInWasClicked = (e) => {
    e.preventDefault()
    document.location.href = ENV.REDIRECT_URI + e.target.pathname
  };

  renderLoggedInNavbar(klassNames, hasLoadMoreButton, pathname) {
    const { profile } = this.props
    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        <NavbarOmniButton callback={ this.omniButtonWasClicked } />
        {
          hasLoadMoreButton ?
          <NavbarMorePostsButton callback={ this.loadMorePostsWasClicked } /> :
          null
        }
        <div className="NavbarLinks">
          <NavbarLink
            to="/discover"
            label="Discover"
            modifiers="LabelOnly"
            pathname={pathname}
            icon={ <SparklesIcon/> }
          />
          <NavbarLink
            to="/following"
            label="Following"
            modifiers="LabelOnly"
            pathname={pathname}
            icon={ <CircleIcon/> }
          />
          <NavbarLink
            to="/starred"
            label="Starred"
            modifiers=""
            pathname={pathname}
            icon={ <StarIcon/> }
          />
          <NavbarLink
            to="/notifications"
            label="Notifications"
            modifiers="IconOnly"
            pathname={pathname}
            icon={ <BoltIcon/> }
          />
          <NavbarLink
            to="/search"
            label="Search"
            modifiers="IconOnly"
            pathname={pathname}
            icon={ <SearchIcon/> }
          />
        </div>
        <NavbarProfile
          avatar={ profile.avatar }
          onLogOut={ this.onLogOut }
          username={ profile.username }
        />
      </nav>
    )
  }

  renderLoggedOutNavbar(klassNames, hasLoadMoreButton, pathname) {
    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        <NavbarLabel />
        {
          hasLoadMoreButton ?
            <NavbarMorePostsButton callback={ this.loadMorePostsWasClicked } /> :
            null
        }
        <div className="NavbarLinks">
          <NavbarLink
            to="/explore"
            label="Discover"
            modifiers="LabelOnly"
            pathname={pathname}
            icon={ <SparklesIcon/> }
          />
          <NavbarLink
            to="/find"
            label="Search"
            modifiers="IconOnly"
            pathname={pathname}
            icon={ <SearchIcon/> }
          />
          <NavbarLink
            to="/enter"
            label="Log in"
            modifiers="LabelOnly"
            pathname={pathname}
            onClick={ this.logInWasClicked }
          />
          <NavbarLink
            to="/signup"
            label="Sign up"
            modifiers="LabelOnly"
            pathname={pathname}
          />
        </div>
      </nav>
    )
  }

  render() {
    const { isLoggedIn, json, pathname } = this.props
    const klassNames = classNames(
      'Navbar',
      { asLocked: this.state.asLocked },
      { asFixed: this.state.asFixed },
      { asHidden: this.state.asHidden },
      { skipTransition: this.state.skipTransition },
    )
    const result = json.pages ? json.pages[pathname] : null
    const hasLoadMoreButton = result && result.newIds

    return isLoggedIn ?
      this.renderLoggedInNavbar(klassNames, hasLoadMoreButton, pathname) :
      this.renderLoggedOutNavbar(klassNames, hasLoadMoreButton, pathname)
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
    json: state.json,
    modalIsActive: state.modal.isActive,
    pathname: state.routing.location.pathname,
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(Navbar)

