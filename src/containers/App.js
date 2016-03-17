import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { autoCompleteUsers, loadEmojis } from '../actions/posts'
import { loadProfile } from '../actions/profile'
import { trackPageView } from '../actions/tracking'
import * as ACTION_TYPES from '../constants/action_types'
import Analytics from '../components/analytics/Analytics'
import DevTools from '../components/devtools/DevTools'
import Footer from '../components/footer/Footer'
import { AppHelmet } from '../components/helmets/AppHelmet'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navbar/Navbar'
import Omnibar from '../components/omnibar/Omnibar'
import Completer from '../components/completers/Completer'
import TextTools from '../components/editor/TextTools'
import { addInputObject, removeInputObject } from '../components/editor/InputComponent'
import { replaceWordFromSelection } from '../components/editor/SelectionUtil'

class App extends Component {

  static propTypes = {
    authentication: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    completions: PropTypes.shape({
      data: PropTypes.array,
      type: PropTypes.string,
    }),
    dispatch: PropTypes.func.isRequired,
    editorStore: PropTypes.object.isRequired,
    emoji: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    editorStore: {},
    lastLocation: '',
  }

  componentWillMount() {
    this.state = {
      activeTools: {},
      coordinates: { top: -200, left: -666 },
      hideCompleter: true,
      hideTextTools: true,
    }
    const loggedOutPaths = {
      explore: /^\/explore/,
      explore_recent: /^\/explore\/recent/,
      explore_trending: /^\/explore\/trending/,
      find: /^\/find$/,
      forgot_password: /^\/forgot-password/,
      signup: /^\/signup/,
    }
    this.lastLocation = ''
    // need to clear out the authentication for the case of
    // when you are on ello.co and go to /onboarding (logging in)
    // then logging out of the mothership wouldn't clear out the
    // authentication here and would show you the wrong navbar
    // and the links would be wrong for user/post detail pages
    const { pathname } = this.props
    let isLoggedOutPath = false
    for (const re in loggedOutPaths) {
      if (pathname.match(loggedOutPaths[re])) {
        isLoggedOutPath = true
        break
      }
    }
    if (isLoggedOutPath) {
      /* eslint-disable no-console */
      console.log('logged out page')
      /* eslint-enable no-console */
    }
    this.onUserCompleter = debounce(this.onUserCompleter, 300)
  }

  componentDidMount() {
    addInputObject(this)
  }

  componentWillReceiveProps(nextProps) {
    const prevAuthentication = this.props.authentication
    const { authentication, dispatch, location } = nextProps
    if (authentication &&
        !prevAuthentication.isLoggedIn &&
        authentication.isLoggedIn &&
        location.pathname !== '/') {
      dispatch(loadProfile())
    }
  }

  componentDidUpdate() {
    const { pathname, dispatch } = this.props
    if (pathname !== this.lastLocation) {
      this.lastLocation = pathname
      dispatch(trackPageView())
    }
  }

  componentWillUnmount() {
    removeInputObject(this)
  }

  onHideCompleter() {
    const { completions, dispatch } = this.props
    this.setState({ hideCompleter: true })
    if (completions) {
      dispatch({ type: ACTION_TYPES.POST.AUTO_COMPLETE_CLEAR })
    }
  }

  onPositionChange(props) {
    this.setState(props)
  }

  onShowTextTools({ activeTools }) {
    this.setState({ hideTextTools: false, activeTools })
  }

  onHideTextTools() {
    this.setState({ hideTextTools: true })
  }

  onUserCompleter({ word }) {
    const { dispatch } = this.props
    dispatch(autoCompleteUsers('user', word))
    this.setState({ hideCompleter: false })
  }

  onEmojiCompleter({ word }) {
    const { dispatch, emoji } = this.props
    if (emoji.emojis && emoji.emojis.length) {
      dispatch({
        type: ACTION_TYPES.EMOJI.LOAD_SUCCESS,
        payload: {
          response: {
            emojis: emoji.emojis,
          },
          type: 'emoji',
          word,
        },
      })
    } else {
      dispatch(loadEmojis('emoji', word))
    }
    this.setState({ hideCompleter: false })
  }

  onCancelAutoCompleter = () => {
    this.onHideCompleter()
    this.onHideTextTools()
    // TODO: maybe clear out the completions from the editor store
  }

  onCompletion = ({ value }) => {
    replaceWordFromSelection(value)
    this.onCancelAutoCompleter()
  }

  render() {
    const { authentication, children, completions, pathname } = this.props
    const { activeTools, coordinates, hideCompleter, hideTextTools } = this.state
    const { isLoggedIn } = authentication
    const appClasses = classNames(
      'App',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={ appClasses }>
        <AppHelmet pathname={ pathname } />
        { isLoggedIn ? <Omnibar /> : null }
        <main className="Main" data-pathname={ pathname } role="main">
          { children }
        </main>
        { !hideCompleter && completions ?
          <Completer
            completions={ completions }
            onCancel={ this.onCancelAutoCompleter }
            onCompletion={ this.onCompletion }
          /> :
          null
        }
        { !hideTextTools ?
          <TextTools
            activeTools={ activeTools }
            isHidden={ hideTextTools }
            coordinates={ coordinates }
            key={ JSON.stringify(activeTools) }
          /> :
          null
        }
        <Navbar />
        <Footer />
        <Modal />
        <DevTools />
        <Analytics isLoggedIn={ isLoggedIn } />
      </section>
    )
  }
}

App.preRender = (store) => {
  const state = store.getState()
  if (state.authentication && state.authentication.isLoggedIn) {
    store.dispatch(loadProfile())
  }
}

function mapStateToProps(state, ownProps) {
  return {
    authentication: state.authentication,
    completions: state.editor.completions,
    emoji: state.emoji,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(App)

