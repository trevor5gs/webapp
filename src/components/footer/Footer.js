import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Mousetrap from '../../vendor/mousetrap'
import { GUI, SHORTCUT_KEYS } from '../../constants/gui_types'
import { LOAD_NEXT_CONTENT_REQUEST } from '../../constants/action_types'
import { PhoneIcon, ChevronIcon, ListIcon, GridIcon } from '../footer/FooterIcons'
import { isAndroid as getIsAndroid } from '../interface/Viewport'
import { findLayoutMode } from '../../reducers/gui'

class Footer extends Component {

  static propTypes = {
    isPaginatoring: PropTypes.bool,
    gui: PropTypes.object.isRequired,
    json: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    username: PropTypes.string,
  }

  componentWillMount() {
    this.state = {
      isAndroid: false,
      isGridMode: true,
    }
    if (typeof window === 'undefined') {
      return
    }
    this.setState({ isAndroid: getIsAndroid() })
  }

  componentWillReceiveProps() {
    const { gui } = this.props
    const currentMode = findLayoutMode(gui.modes)
    this.setState({ isGridMode: currentMode && currentMode.mode === 'grid' })
  }

  onClickScrollToTop = () => {
    if (typeof window === 'undefined') { return }
    const { pathname, username } = this.props
    let offset = 0
    if (username || /\/settings/.test(pathname)) {
      offset = Math.round((window.innerWidth * 0.5625)) - 200
    }
    window.scrollTo(0, offset)
  }

  onClickToggleLayoutMode = () => {
    Mousetrap.trigger(SHORTCUT_KEYS.TOGGLE_LAYOUT)
  }

  render() {
    const { isPaginatoring } = this.props
    const { isAndroid, isGridMode } = this.state
    return (
      <footer
        className={classNames('Footer', { isPaginatoring })}
        role="contentinfo"
      >
        <div className="FooterLinks">
          <FooterLabel label="Beta 2.2" />
          <FooterLink className="asLabel" href={ `${ENV.AUTH_DOMAIN}/wtf` } label="WTF" />
          { isAndroid ?
            null :
            <FooterLink
              href="http://appstore.com/ello/ello"
              label="Get the app"
              icon={ <PhoneIcon /> }
            />
          }
        </div>

        <div className="FooterTools">
          <FooterTool
            className="TopTool"
            label="Top"
            icon={ <ChevronIcon /> }
            onClick={ this.onClickScrollToTop }
import { FooterLabel } from '../footer/FooterLabel'
import { FooterLink } from '../footer/FooterLink'
import { FooterTool } from '../footer/FooterTool'
          />
          <FooterTool
            className="LayoutTool"
            label={ isGridMode ? 'List View' : 'Grid View' }
            icon={ isGridMode ? <ListIcon /> : <GridIcon /> }
            onClick={ this.onClickToggleLayoutMode }
          />
        </div>
      </footer>
    )
  }
}

function mapStateToProps(state) {
  const isPaginatoring = state.stream.type === LOAD_NEXT_CONTENT_REQUEST &&
    GUI.viewportDeviceSize === 'mobile'
  return {
    gui: state.gui,
    isPaginatoring,
    json: state.json,
    pathname: state.routing.location.pathname,
  }
}

export default connect(mapStateToProps)(Footer)

