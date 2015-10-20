import React from 'react'
import classNames from 'classnames'
import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'
import { SHORTCUT_KEYS } from '../../constants/action_types'
import { openModal, closeModal } from '../../actions/modals'
import HelpDialog from '../dialogs/HelpDialog'


class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      asFixed: false,
      asDocked: false,
    }
  }

  componentDidMount() {
    this.ticking = false
    this.lastScrollY = this.getScrollY()
    this.lastScrollDirection = (this.lastScrollY > 600) ? 'down' : 'up'

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

    window.addEventListener('scroll', this.windowDidScroll.bind(this))
  }

  componentWillUnmount() {
    Mousetrap.unbind(Object.keys(this.props.shortcuts))
    Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    window.removeEventListener('scroll', this.windowDidScroll)
  }

  getScrollY() {
    return Math.ceil(window.pageYOffset)
  }

  updateNavbarPosition() {
    const scrollY = this.getScrollY()
    const distance = Math.abs(scrollY - this.lastScrollY)
    const direction = (scrollY > this.lastScrollY) ? 'down' : 'up'

    if (scrollY <= 0 && this.state.asFixed) {
      this.setState({ asFixed: false, asDocked: false, skipTransition: false })
      return
    }

    if (scrollY >= 600 && !this.state.asFixed) {
      this.setState({ asFixed: true })
      this.setState({ skipTransition: true })
    } else if (this.state.skipTransition) {
      this.setState({ skipTransition: false })
    }

    if (scrollY < 600 || distance < 50 || scrollY === this.lastScrollY) {
      return
    }

    if (direction !== this.lastScrollDirection) {
      this.setState({ asDocked: direction === 'up' && this.state.asFixed })
    }
    this.lastScrollY = scrollY
    this.lastScrollDirection = direction
  }

  windowDidScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateNavbarPosition()
        this.ticking = false
      })
      this.ticking = true
    }
  }


  render() {
    const klassNames = classNames(
      'Navbar',
      { asFixed: this.state.asFixed },
      { asDocked: this.state.asDocked },
      { skipTransition: this.state.skipTransition },
    )
    return (
      <nav className={klassNames} role="navigation">
        <Link className="NavbarMark" to="/">
          <ElloMark />
        </Link>
        <div className="NavbarLinks">
          <Link to="/following">Following</Link>
          <Link to="/starred">Starred</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/search">Search</Link>
          <Link to="/onboarding/communities">Onboarding</Link>
        </div>
      </nav>
    )
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    modals: state.modals,
  }
}
Navbar.contextTypes = {
  router: React.PropTypes.object.isRequired,
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
}

export default connect(mapStateToProps)(Navbar)

