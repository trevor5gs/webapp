import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const Viewport = (props) =>
  <div
    className={classNames(
      'Viewport',
      { isNavbarFixed: props.isNavbarFixed },
      { isNavbarHidden: props.isNavbarHidden },
      { isNavbarSkippingTransition: props.isNavbarSkippingTransition },
      { isNotificationsActive: props.isNotificationsActive },
      { isOffsetLayout: props.isOffsetLayout },
      { isProfileMenuActive: props.isProfileMenuActive },
    )}
    data-pathname={props.pathname}
    role="presentation"
  />

Viewport.propTypes = {
  isNavbarFixed: PropTypes.bool.isRequired,
  isNavbarHidden: PropTypes.bool.isRequired,
  isNavbarSkippingTransition: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isOffsetLayout: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
}

