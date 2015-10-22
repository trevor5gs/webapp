import React from 'react'
import classNames from 'classnames'
import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'
import { SHORTCUT_KEYS } from '../../constants/action_types'
import { openModal, closeModal } from '../../actions/modals'
import Avatar from '../users/Avatar'
import HelpDialog from '../dialogs/HelpDialog'
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
    } else if (this.state.skipTransition) {
      this.setState({ skipTransition: false })
    }

    // Scroll just changed directions so it's about to either be shown or hidden
    if (scrollY >= 600 && this.scrollYAtDirectionChange) {
      const distance = Math.abs(scrollY - this.scrollYAtDirectionChange)
      const delay = scrollDirection === 'down' ? 20 : 80

      if (distance >= delay ) {
        this.setState({ asHidden: scrollDirection === 'down' })
        this.scrollYAtDirectionChange = null
      }
    }
  }


  renderProfileAvatar(profile) {
    const { payload } = profile
    const { avatar, username} = payload
    if (avatar && username) {
      return (
        <Link className="NavbarProfile" to={`/${username}`}>
          <Avatar imgSrc={avatar.regular.url} />
        </Link>
      )
    }
    return (
      <span className="NavbarProfile">
        <Avatar/>
      </span>
    )
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
        <Link className="NavbarMark" to="/">
          <ElloMark />
        </Link>
        <h2>Be Inspired.</h2>
        <div className="NavbarLinks">
          <Link to="/following">Following</Link>
          <Link to="/starred">Starred</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/search">Search</Link>
          <Link to="/onboarding/communities">Onboarding</Link>
        </div>
        { this.renderProfileAvatar(profile) }
      </nav>
    )
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    modals: state.modals,
    profile: state.profile,
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
  profile: React.PropTypes.object,
}

export default connect(mapStateToProps)(Navbar)

