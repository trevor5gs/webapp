/*eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { PROFILE } from '../../constants/action_types'

function addTrackingSnippet(src) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = src
  const s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(script, s)
}

export function addSegment(uid, createdAt) {
  !function(){const analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){const e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(let t=0;t<analytics.methods.length;t++){const e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){const e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";const n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};
    analytics.SNIPPET_VERSION="3.0.1";
    analytics.load(ENV.SEGMENT_WRITE_KEY);
    if (uid) {
      analytics.identify(uid, { createdAt: createdAt, ui_version: ENV.UI_VERSION });
    }
    analytics.page()
    }}();
}

export function doesAllowTracking() {
  return (window.navigator.doNotTrack === '1' ||
          window.navigator.msDoNotTrack === '1' ||
          window.doNotTrack === '1' ||
          window.msDoNotTrack === '1') ?
          false : true
}

class Analytics extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.hasLoadedTracking = false
  }

  componentDidUpdate() {
    if (this.hasLoadedTracking) {
      return
    }
    const { profile } = this.props
    if (profile.type === PROFILE.LOAD_SUCCESS) {
      this.profileDidLoad()
      this.hasLoadedTracking = true
    } else if (profile.type === PROFILE.LOAD_FAILURE) {
      this.profileDidFail()
    }
  }

  profileDidLoad() {
    const { gaUniqueId, createdAt, allowsAnalytics } = this.props.profile.payload
    if (allowsAnalytics) {
      addSegment(gaUniqueId, createdAt)
    }
  }

  profileDidFail() {
    if (doesAllowTracking()) {
      addSegment()
    }
  }

  render() {
    return null
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

Analytics.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  profile: React.PropTypes.shape,
}

export default connect(mapStateToProps)(Analytics)

