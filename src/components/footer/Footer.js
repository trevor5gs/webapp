import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Mousetrap from '../../vendor/mousetrap'
import { SHORTCUT_KEYS } from '../../constants/gui_types'
import { PhoneIcon, ChevronIcon, ListIcon, GridIcon } from '../footer/FooterIcons'
import FooterLabel from '../footer/FooterLabel'
import FooterLink from '../footer/FooterLink'
import FooterTool from '../footer/FooterTool'

class Footer extends Component {
  static propTypes = {
    json: PropTypes.object,
    router: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      isAndroid: false,
      isGridMode: true,
    }
  }

  componentWillMount() {
    if (typeof window === 'undefined') {
      return
    }
    this.setState({ isAndroid: !(navigator.userAgent.match(/Android/i) === null) })
  }

  componentWillReceiveProps() {
    const { json, router } = this.props
    let result = null
    if (json.pages) {
      result = json.pages[router.location.pathname]
    }
    if (result && result.mode) {
      this.setState({ isGridMode: result.mode === 'grid' })
    }
  }

  scrollToTop() {
    if (typeof window === 'undefined') {
      return
    }
    window.scrollTo(0, 0)
  }

  toggleLayoutMode() {
    Mousetrap.trigger(SHORTCUT_KEYS.TOGGLE_LAYOUT)
  }

  render() {
    const { isAndroid, isGridMode } = this.state
    return (
      <footer className="Footer" role="contentinfo">
        <div className="FooterLinks">
          <FooterLabel label="Beta 2.2"/>
          <FooterLink className="asLabel" href="/wtf" label="WTF"/>
          { isAndroid ? null : <FooterLink href="http://appstore.com/ello/ello" label="Get the app" icon={ <PhoneIcon/> }/> }
        </div>

        <div className="FooterTools">
          <FooterTool
            className="TopTool"
            label="Top"
            icon={ <ChevronIcon/> }
            onClick={ ::this.scrollToTop }
          />
          <FooterTool
            className="LayoutTool"
            label={ isGridMode ? 'List View' : 'Grid View' }
            icon={ isGridMode ? <ListIcon/> : <GridIcon/> }
            onClick={ ::this.toggleLayoutMode }
          />
        </div>
      </footer>
    )
  }
}

function mapStateToProps(state) {
  return {
    json: state.json,
    router: state.router,
  }
}

export default connect(mapStateToProps)(Footer)

