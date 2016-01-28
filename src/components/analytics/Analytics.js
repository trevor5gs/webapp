/* eslint-disable */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { PROFILE } from '../../constants/action_types'

export function addSegment(uid, createdAt) {
  if (window) {
    !function(){const analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){const e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(let t=0;t<analytics.methods.length;t++){const e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){const e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";const n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};
      analytics.SNIPPET_VERSION="3.0.1";
      analytics.load(ENV.SEGMENT_WRITE_KEY);
      if (uid) {
        analytics.identify(uid, { createdAt: createdAt, ui_version: ENV.UI_VERSION });
      }
      }}();
  }
}

export function doesAllowTracking() {
  if (!window) { return false }
  return (window.navigator.doNotTrack === '1' ||
          window.navigator.msDoNotTrack === '1' ||
          window.doNotTrack === '1' ||
          window.msDoNotTrack === '1') ?
          false : true
}

class Analytics extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    profile: PropTypes.object,
  };

  componentWillMount() {
    this.hasLoadedTracking = false
  }

  componentDidMount() {
    const { isLoggedIn } = this.props
    if (this.hasLoadedTracking) {
      return
    }
    if (!isLoggedIn && doesAllowTracking()) {
      this.hasLoadedTracking = true
      return addSegment()
    }
  }

  componentDidUpdate() {
    if (this.hasLoadedTracking) {
      return
    }
    const { profile } = this.props
    if (profile.type === PROFILE.LOAD_SUCCESS) {
      this.profileDidLoad()
    } else if (profile.type === PROFILE.LOAD_FAILURE) {
      this.profileDidFail()
    }
  }

  profileDidLoad() {
    const { gaUniqueId, createdAt, allowsAnalytics } = this.props.profile.payload
    if (allowsAnalytics) {
      this.hasLoadedTracking = true
      addSegment(gaUniqueId, createdAt)
    }
  }

  profileDidFail() {
    if (doesAllowTracking() && !this.hasLoadedTracking) {
      this.hasLoadedTracking = true
      addSegment()
    }
  }

  render() {
    return null
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(Analytics)

