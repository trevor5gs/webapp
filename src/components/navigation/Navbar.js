import React from 'react'
import Mousetrap from 'mousetrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'
import { SHORTCUT_KEYS } from '../../constants/action_types'
import { openModal, closeModal } from '../../actions/modals'
import HelpDialog from '../dialogs/HelpDialog'


class Navbar extends React.Component {

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
  }

  componentWillUnmount() {
    Mousetrap.unbind(Object.keys(this.props.shortcuts))
    Mousetrap.unbind(SHORTCUT_KEYS.HELP)
  }

  render() {
    return (
      <nav className="Navbar" role="navigation">
        <Link to="/">
          <ElloMark />
        </Link>
        <div className="NavbarLinks">
          <Link to="/discover">Discover</Link>
          <Link to="/search">Search</Link>
          <Link to="/onboarding/channels">Onboarding</Link>
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
    [SHORTCUT_KEYS.ONBOARDING]: '/onboarding/channels',
  },
}

Navbar.propTypes = {
  shortcuts: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  modals: React.PropTypes.shape({
    payload: React.PropTypes.shape,
  }),
}

export default connect(mapStateToProps)(Navbar)

