import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { debounce, get } from 'lodash'
import { autoCompleteUsers, loadEmojis } from '../actions/posts'
import { loadProfile } from '../actions/profile'
import { setIsOffsetLayout } from '../actions/gui'
import * as ACTION_TYPES from '../constants/action_types'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import DevTools from '../components/devtools/DevTools'
import { AppHelmet } from '../components/helmets/AppHelmet'
import Modal from '../components/modals/Modal'
import Omnibar from '../components/omnibar/Omnibar'
import Completer from '../components/completers/Completer'
import TextTools from '../components/editor/TextTools'
import { addInputObject, removeInputObject } from '../components/editor/InputComponent'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDrag'
import { replaceWordFromSelection } from '../components/editor/SelectionUtil'
import FooterContainer from '../containers/FooterContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import NavbarContainer from '../containers/NavbarContainer'
import ViewportContainer from '../containers/ViewportContainer'

class AppContainer extends Component {

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
    isOffsetLayout: PropTypes.bool,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    params: PropTypes.shape({
      username: PropTypes.string,
      token: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
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
    addInputObject(this)
    addGlobalDrag()
    this.updateIsOffsetLayout()
    if (get(this.props, 'authentication.isLoggedIn')) {
      const { dispatch } = this.props
      dispatch(loadProfile())
    }
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

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname === this.props.location.pathname) { return }
    this.updateIsOffsetLayout()
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

  // TODO: Maybe move this out to a Viewport object?
  updateIsOffsetLayout() {
    const { isOffsetLayout, location: { pathname }, params: { username, token } } = this.props
    const isUserDetailOrSettings = (username && !token) || pathname === '/settings'
    if (isOffsetLayout !== isUserDetailOrSettings) {
      this.props.dispatch(setIsOffsetLayout({ isOffsetLayout: isUserDetailOrSettings }))
    }
  }

  render() {
    const { authentication, children, completions, params, pathname } = this.props
    const { activeTools, coordinates, hideCompleter, hideTextTools } = this.state
    const { isLoggedIn } = authentication
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={ appClasses }>
        <AppHelmet pathname={ pathname } />
        <ViewportContainer />
        { isLoggedIn ? <Omnibar /> : null }
        { children }
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
        <NavbarContainer routerParams={ params } />
        <FooterContainer />
        <Modal />
        <DevTools />
        <template>
          <KeyboardContainer />
          <AnalyticsContainer />
        </template>
      </section>
    )
  }
}

AppContainer.preRender = (store) => {
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
    isOffsetLayout: state.gui.isOffsetLayout,
  }
}

export default connect(mapStateToProps)(AppContainer)

