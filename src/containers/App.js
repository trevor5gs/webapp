import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { autoCompleteUsers, loadEmojis } from '../actions/posts'
import { loadProfile } from '../actions/profile'
import * as ACTION_TYPES from '../constants/action_types'
import Analytics from '../components/analytics/Analytics'
import DevTools from '../components/devtools/DevTools'
import { AppHelmet } from '../components/helmets/AppHelmet'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navbar/Navbar'
import Omnibar from '../components/omnibar/Omnibar'
import Completer from '../components/completers/Completer'
import TextTools from '../components/editor/TextTools'
import { addInputObject, removeInputObject } from '../components/editor/InputComponent'
import { addFeatureDetection } from '../components/interface/Viewport'
import { addGlobalDrag, removeGlobalDrag } from '../components/interface/GlobalDrag'
import { replaceWordFromSelection } from '../components/editor/SelectionUtil'
import FooterContainer from '../containers/FooterContainer'

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
    params: PropTypes.shape({
      username: PropTypes.string,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    editorStore: {},
  }

  componentWillMount() {
    this.state = {
      activeTools: {},
      coordinates: { top: -200, left: -666 },
      hideCompleter: true,
      hideTextTools: true,
    }
    this.onUserCompleter = debounce(this.onUserCompleter, 300)
  }

  componentDidMount() {
    addFeatureDetection()
    addInputObject(this)
    addGlobalDrag()
  }

  componentWillReceiveProps(nextProps) {
    const prevAuthentication = this.props.authentication
    const { authentication, dispatch } = nextProps
    if (authentication &&
        !prevAuthentication.isLoggedIn &&
        authentication.isLoggedIn) {
      dispatch(loadProfile())
    }
  }

  componentWillUnmount() {
    removeInputObject(this)
    removeGlobalDrag()
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
    const { authentication, children, completions, params, pathname } = this.props
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
        <FooterContainer username={ params.username } />
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

