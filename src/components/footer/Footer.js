import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Mousetrap from '../../vendor/mousetrap'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { LOAD_NEXT_CONTENT_REQUEST } from '../../constants/action_types'
import { PhoneIcon, ChevronIcon, ListIcon, GridIcon } from '../footer/FooterIcons'
import FooterLabel from '../footer/FooterLabel'
import FooterLink from '../footer/FooterLink'
import FooterTool from '../footer/FooterTool'
import { findLayoutMode } from '../../reducers/gui'

class Footer extends Component {

  static propTypes = {
    isPaginatoring: PropTypes.bool,
    gui: PropTypes.object.isRequired,
    json: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
  };

  componentWillMount() {
    this.state = {
      isAndroid: false,
      isGridMode: true,
    }
    if (typeof window === 'undefined') {
      return
    }
    this.setState({ isAndroid: !(navigator.userAgent.match(/Android/i) === null) })
  }

  componentWillReceiveProps() {
    const { gui } = this.props
    const currentMode = findLayoutMode(gui.modes)
    this.setState({ isGridMode: currentMode && currentMode.mode === 'grid' })
  }

  scrollToTop = () => {
    if (typeof window === 'undefined') {
      return
    }
    window.scrollTo(0, 0)
  };

  toggleLayoutMode = () => {
    Mousetrap.trigger(SHORTCUT_KEYS.TOGGLE_LAYOUT)
  };

  render() {
    const { isPaginatoring } = this.props
    const { isAndroid, isGridMode } = this.state
    return (
      <footer
        className={classNames('Footer', { isPaginatoring })}
        role="contentinfo"
      >
        <div className="FooterLinks">
          <FooterLabel label="Beta 2.2"/>
          <FooterLink className="asLabel" href="/wtf" label="WTF"/>
          { isAndroid ?
            null :
            <FooterLink
              href="http://appstore.com/ello/ello"
              label="Get the app"
              icon={ <PhoneIcon/> }
            />
          }
        </div>

        <div className="FooterTools">
          <FooterTool
            className="TopTool"
            label="Top"
            icon={ <ChevronIcon/> }
            onClick={ this.scrollToTop }
          />
          <FooterTool
            className="LayoutTool"
            label={ isGridMode ? 'List View' : 'Grid View' }
            icon={ isGridMode ? <ListIcon/> : <GridIcon/> }
            onClick={ this.toggleLayoutMode }
          />
        </div>
      </footer>
    )
  }
}

function mapStateToProps(state) {
  return {
    gui: state.gui,
    isPaginatoring: state.stream.type === LOAD_NEXT_CONTENT_REQUEST,
    json: state.json,
    pathname: state.routing.location.pathname,
  }
}

export default connect(mapStateToProps)(Footer)

