import React, { PropTypes } from 'react'
import classNames from 'classnames'

// type Props = {
//   isAuthenticationView: boolean,
//   isDiscoverView: boolean,
//   isNavbarHidden: boolean,
//   isNotificationsActive: boolean,
//   isOnboardingView: boolean,
//   isProfileMenuActive: boolean,
//   userDetailPathClassName?: string,
// }

// export default(props: Props) =>
export const Viewport = props =>
  <div
    className={classNames(
      'Viewport',
      { isAuthenticationView: props.isAuthenticationView },
      { isDiscoverView: props.isDiscoverView },
      { isNavbarHidden: props.isNavbarHidden },
      { isNotificationsActive: props.isNotificationsActive },
      { isOnboardingView: props.isOnboardingView },
      { isProfileMenuActive: props.isProfileMenuActive },
      props.userDetailPathClassName,
    )}
    role="presentation"
  />

Viewport.propTypes = {
  isAuthenticationView: PropTypes.bool.isRequired,
  isDiscoverView: PropTypes.bool.isRequired,
  isNavbarHidden: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isOnboardingView: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  userDetailPathClassName: PropTypes.string,
}

export default Viewport

