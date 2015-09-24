import React from 'react'
import { connect } from 'react-redux'
import { trackPageView } from '../../actions/tracking'
import { PROFILE } from '../../constants/action_types'

function addTrackingSnippet(src) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = src
  const s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(script, s)
}

export function addSegment() {
  const analytics = window.analytics = window.analytics || []
  analytics.invoked = !0
  analytics.methods = ['identify', 'track', 'page']
  analytics.factory = (t) => {
    return () => {
      const e = Array.prototype.slice.call(arguments)
      e.unshift(t)
      analytics.push(e)
      return analytics
    }
  }
  for (let t = 0; t < analytics.methods.length; t++) {
    const e = analytics.methods[t]
    analytics[e] = analytics.factory(e)
  }
  const src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'cdn.segment.com/analytics.js/v1/' + ENV.SEGMENT_WRITE_KEY + '/analytics.min.js'
  addTrackingSnippet(src)
}

export function identifyForSegment(uid, createdAt) {
  window.analytics.identify(uid, {
    createdAt: createdAt,
    uiVersion: ENV.UI_VERSION,
  })
}

export function addGoogleAnalytics() {
  window.GoogleAnalyticsObject = 'ga'
  window.ga = window.ga || () => { (window.ga.q = window.ga.q || []).push(arguments) }
  window.ga.l = 1 * new Date()
  addTrackingSnippet('//www.google-analytics.com/analytics.js')
}

export function identifyForGoogle(uid, createdAt) {
  const ga = window.ga
  ga('create', ENV.GA_ACCOUNT_ID, { 'userId': uid })
  ga('set', 'anonymizeIp', true)
  ga('set', 'dimension1', createdAt)
  ga('set', 'dimension2', ENV.UI_VERSION)
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
    } else if (profile.type === PROFILE.LOAD_FAILURE) {
      this.profileDidFail()
    }
    this.props.dispatch(trackPageView())
    this.hasLoadedTracking = true
  }

  profileDidLoad() {
    const { gaUniqueId, createdAt, allowsAnalytics } = this.props.profile.payload
    if (allowsAnalytics) {
      addGoogleAnalytics()
      addSegment()
      identifyForGoogle(gaUniqueId, createdAt)
      identifyForSegment(gaUniqueId, createdAt)
    }
  }

  profileDidFail() {
    if (doesAllowTracking()) {
      addGoogleAnalytics()
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

