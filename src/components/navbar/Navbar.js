import React from 'react'
import classNames from 'classnames'
// import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import NavbarLabel from './NavbarLabel'
import NavbarOmniButton from './NavbarOmniButton'
import NavbarLink from './NavbarLink'
import NavbarMark from './NavbarMark'
import NavbarProfile from './NavbarProfile'
import { BoltIcon, CircleIcon, SearchIcon, SparklesIcon, StarIcon } from '../navbar/NavbarIcons'
// import HelpDialog from '../dialogs/HelpDialog'
// import { openModal, closeModal } from '../../actions/modal'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'


class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.scrollYAtDirectionChange = null
    this.state = {
      asLocked: false,
      asFixed: false,
      asHidden: false,
      skipTransition: false,
      offset: Math.round((window.innerWidth * 0.5625)),
    }
  }

  componentDidMount() {
    // Mousetrap.bind(Object.keys(this.props.shortcuts), (event, shortcut) => {
    //   const { router } = this.context
    //   router.transitionTo(this.props.shortcuts[shortcut])
    // })

    // Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
    //   const { dispatch, modal } = this.props
    //   if (modal.payload) {
    //     return dispatch(closeModal())
    //   }
    //   return dispatch(openModal(<HelpDialog/>))
    // })
    addScrollObject(this)
  }

  componentWillReceiveProps(nextProps) {
    const { router } = nextProps
    const pathnames = router.location.pathname.split('/').slice(1)
    const whitelist = ['', 'discover', 'following', 'starred', 'notifications', 'search', 'invitations', 'onboarding', 'staff', 'find']
    const isWhitelisted = (whitelist.indexOf(pathnames[0]) >= 0 || pathnames[1] === 'post')
    this.setState({ asLocked: !isWhitelisted })
  }

  componentDidUpdate() {
    if (this.state.asLocked) {
      window.scrollTo(0, this.state.offset - 120)
    }
  }


  componentWillUnmount() {
    // Mousetrap.unbind(Object.keys(this.props.shortcuts))
    // Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    removeScrollObject(this)
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

  render() {
    const { profile } = this.props
    const showLabel = true
    const klassNames = classNames(
      'Navbar',
      { asLocked: this.state.asLocked },
      { asFixed: this.state.asFixed },
      { asHidden: this.state.asHidden },
      { skipTransition: this.state.skipTransition },
    )

    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        { showLabel ? <NavbarLabel /> : <NavbarOmniButton callback={this.omniButtonWasClicked.bind(this)} />}
        <div className="NavbarLinks">
          <NavbarLink to="/following" label="Following" icon={ <CircleIcon/> } />
          <NavbarLink to="/starred" label="Starred" icon={ <StarIcon/> } />
          <NavbarLink to="/discover" label="Discover" icon={ <SparklesIcon/> } />
          <NavbarLink to="/notifications" label="Notifications" icon={ <BoltIcon/> } />
          <NavbarLink to="/search" label="Search" icon={ <SearchIcon/> } />
        </div>
          <NavbarProfile { ...profile.payload } />
      </nav>
    )
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    modal: state.modal,
    profile: state.profile,
    router: state.router,
  }
}

Navbar.defaultProps = {
  shortcuts: {
    [SHORTCUT_KEYS.SEARCH]: '/search',
    [SHORTCUT_KEYS.DISCOVER]: '/discover',
    [SHORTCUT_KEYS.ONBOARDING]: '/onboarding/communities',
  },
}

Navbar.propTypes = {
  shortcuts: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  modal: React.PropTypes.object,
  profile: React.PropTypes.object,
  router: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Navbar)

