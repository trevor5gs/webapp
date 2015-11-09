import React from 'react'
import classNames from 'classnames'
import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
import { SHORTCUT_KEYS } from '../../constants/action_types'
import NavbarLabel from './NavbarLabel'
import NavbarLink from './NavbarLink'
import NavbarMark from './NavbarMark'
import NavbarProfile from './NavbarProfile'
import { BoltIcon, CircleIcon, SearchIcon, SparklesIcon, StarIcon } from '../iconography/Icons'
import HelpDialog from '../dialogs/HelpDialog'
import { openModal, closeModal } from '../../actions/modals'
import { addScrollObject, removeScrollObject } from '../scroll/ScrollComponent'


class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.scrollYAtDirectionChange = null
    this.state = {
      asFixed: false,
      asHidden: false,
      skipTransition: false,
    }
  }

  componentDidMount() {
    Mousetrap.bind(Object.keys(this.props.shortcuts), (event, shortcut) => {
      const { router } = this.context
      router.transitionTo(this.props.shortcuts[shortcut])
    })

    Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
      const { dispatch, modals } = this.props
      if (modals.payload) {
        return dispatch(closeModal())
      }
      return dispatch(openModal(<HelpDialog/>))
    })
    addScrollObject(this)
  }

  componentWillUnmount() {
    Mousetrap.unbind(Object.keys(this.props.shortcuts))
    Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    removeScrollObject(this)
  }


  onScrollTop() {
    if (this.state.asFixed) {
      this.setState({ asFixed: false, asHidden: false, skipTransition: false })
    }
  }

  onScrollBottom() {
    if (this.state.asFixed) {
      this.setState({ asFixed: true, asHidden: false, skipTransition: false })
    }
  }

  onScrollDirectionChange(scrollProperties) {
    const { scrollY } = scrollProperties

    if (scrollY >= 600) {
      this.scrollYAtDirectionChange = scrollY
    }
  }

  onScroll(scrollProperties) {
    const { scrollY, scrollDirection } = scrollProperties

    // Going from absolute to fixed positioning
    if (scrollY >= 600 && !this.state.asFixed) {
      this.setState({ asFixed: true, asHidden: true, skipTransition: true })
    }

    // Scroll just changed directions so it's about to either be shown or hidden
    if (scrollY >= 600 && this.scrollYAtDirectionChange) {
      const distance = Math.abs(scrollY - this.scrollYAtDirectionChange)
      const delay = scrollDirection === 'down' ? 20 : 80

      if (distance >= delay ) {
        this.setState({ asHidden: scrollDirection === 'down', skipTransition: false })
        this.scrollYAtDirectionChange = null
      }
    }
  }


  render() {
    const { profile } = this.props
    const klassNames = classNames(
      'Navbar',
      { asFixed: this.state.asFixed },
      { asHidden: this.state.asHidden },
      { skipTransition: this.state.skipTransition },
    )

    return (
      <nav className={klassNames} role="navigation">
        <NavbarMark />
        <NavbarLabel />
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
    modals: state.modals,
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
  modals: React.PropTypes.object,
  profile: React.PropTypes.object,
  router: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Navbar)

