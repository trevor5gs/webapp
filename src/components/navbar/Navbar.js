import React from 'react'
import classNames from 'classnames'
import Mousetrap from 'mousetrap'
import { replaceState } from 'redux-router'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import NavbarLabel from './NavbarLabel'
import NavbarOmniButton from './NavbarOmniButton'
import NavbarLink from './NavbarLink'
import NavbarMark from './NavbarMark'
import NavbarMorePostsButton from './NavbarMorePostsButton'
import NavbarProfile from './NavbarProfile'
import { BoltIcon, CircleIcon, SearchIcon, SparklesIcon, StarIcon } from '../navbar/NavbarIcons'
import HelpDialog from '../dialogs/HelpDialog'
import { openModal, closeModal } from '../../actions/modals'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'
import * as ACTION_TYPES from '../../constants/action_types'


class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.scrollYAtDirectionChange = null
    this.state = {
      asLocked: false,
      asFixed: false,
      asHidden: false,
      skipTransition: false,
      offset: Math.round((window.innerWidth * 0.5625) - 120),
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    Mousetrap.bind(Object.keys(this.props.shortcuts), (event, shortcut) => {
      dispatch(replaceState(window.history.state, this.props.shortcuts[shortcut]))
    })

    Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
      const { modal } = this.props
      if (modal.payload) {
        return dispatch(closeModal())
      }
      return dispatch(openModal(<HelpDialog/>))
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

      if (distance >= delay ) {
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

  render() {
    const { json, profile, router } = this.props
    const showLabel = true
    const klassNames = classNames(
      'Navbar',
      { asLocked: this.state.asLocked },
      { asFixed: this.state.asFixed },
      { asHidden: this.state.asHidden },
      { skipTransition: this.state.skipTransition },
    )

    const result = json.pages && router ? json.pages[router.location.pathname] : null
    const hasLoadMoreButton = result && result.newIds

    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        { showLabel ? <NavbarLabel /> : <NavbarOmniButton callback={this.omniButtonWasClicked.bind(this)} />}
        { hasLoadMoreButton ? <NavbarMorePostsButton callback={this.loadMorePostsWasClicked.bind(this)} /> : null }
        <div className="NavbarLinks">
          <NavbarLink to="/discover" label="Discover" icon={ <SparklesIcon/> } />
          <NavbarLink to="/following" label="Following" icon={ <CircleIcon/> } />
          <NavbarLink to="/starred" label="Starred" icon={ <StarIcon/> } />
          <NavbarLink to="/notifications" label="Notifications" icon={ <BoltIcon/> } />
          <NavbarLink to="/search" label="Search" onClick={this.searchWasClicked.bind(this)} icon={ <SearchIcon/> } />
        </div>
          <NavbarProfile { ...profile.payload } />
      </nav>
    )
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    json: state.json,
    modal: state.modal,
    profile: state.profile,
    router: state.router,
  }
}

Navbar.defaultProps = {
  shortcuts: {
    [SHORTCUT_KEYS.SEARCH]: '/search',
    [SHORTCUT_KEYS.DISCOVER]: '/discover',
    [SHORTCUT_KEYS.FOLLOWING]: '/following',
    [SHORTCUT_KEYS.ONBOARDING]: '/onboarding/communities',
  },
}

Navbar.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  json: React.PropTypes.object.isRequired,
  modal: React.PropTypes.object,
  profile: React.PropTypes.object,
  router: React.PropTypes.object.isRequired,
  shortcuts: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Navbar)

