import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Mousetrap from '../../vendor/mousetrap'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { PhoneIcon, ChevronIcon, ListIcon, GridIcon } from '../footer/FooterIcons'
import FooterLabel from '../footer/FooterLabel'
import FooterLink from '../footer/FooterLink'
import FooterTool from '../footer/FooterTool'

class Footer extends Component {

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
    const { json, pathname } = this.props
    let result = null
    if (json.pages) {
      result = json.pages[pathname]
    }
    if (result && result.mode) {
      this.setState({ isGridMode: result.mode === 'grid' })
    }
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
    const { isAndroid, isGridMode } = this.state
    return (
      <footer className="Footer" role="contentinfo">
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

Footer.propTypes = {
  json: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {
    json: state.json,
    pathname: state.routing.location.pathname,
  }
}

export default connect(mapStateToProps)(Footer)

