import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { css } from 'glamor'
import { selectIsLoggedIn } from '../selectors/authentication'
import { trackEvent, trackInitialPage } from '../actions/analytics'
import { getCategories, getPagePromotionals } from '../actions/discover'
import { setSignupModalLaunched } from '../actions/gui'
import { openModal } from '../actions/modals'
import { loadAnnouncements, loadNotifications } from '../actions/notifications'
import { loadProfile } from '../actions/profile'
import { fetchAuthenticationPromos } from '../actions/promotions'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import DevTools from '../components/devtools/DevTools'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDragComponent'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import FooterContainer from '../containers/FooterContainer'
import HeroContainer from '../containers/HeroContainer'
import InputContainer from '../containers/InputContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import MetaContainer from '../containers/MetaContainer'
import ModalContainer from '../containers/ModalContainer'
import NavbarContainer from '../containers/NavbarContainer'
import OmnibarContainer from '../containers/OmnibarContainer'
import ViewportContainer from '../containers/ViewportContainer'
import {
  selectCategoryData,
  selectIsCategoryPromotion,
  selectIsPagePromotion,
  selectRandomAuthPromotion,
} from '../selectors/promotions'
import { selectIsAuthenticationView } from '../selectors/routing'
import { scrollToPosition } from '../lib/jello'
import { baseStyles, atlasGroteskRegular, atlasGroteskBold, atlasGroteskTypewriter } from '../styles/css'

// Inline fonts and global CSS
css.insert(atlasGroteskRegular)
css.insert(atlasGroteskBold)
css.insert(atlasGroteskTypewriter)
css.insert(baseStyles)

function mapStateToProps(state) {
  return {
    authPromo: selectRandomAuthPromotion(state),
    categoryData: selectCategoryData(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isCategoryPromotion: selectIsCategoryPromotion(state),
    isLoggedIn: selectIsLoggedIn(state),
    isPagePromotion: selectIsPagePromotion(state),
  }
}

class AppContainer extends Component {

  static propTypes = {
    authPromo: PropTypes.object,
    categoryData: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticationView: PropTypes.bool.isRequired,
    isCategoryPromotion: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPagePromotion: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
  }

  static defaultProps = {
    authPromo: null,
  }

  static preRender = (store) => {
    const state = store.getState()
    if (state.authentication.get('isLoggedIn')) {
      return Promise.all([
        store.dispatch(loadProfile()),
        store.dispatch(getCategories()),
        store.dispatch(getPagePromotionals()),
      ])
    }
    return Promise.all([
      store.dispatch(getCategories()),
      store.dispatch(getPagePromotionals()),
    ])
  }

  static childContextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
    onClickScrollToContent: PropTypes.func,
    onClickTrackCredits: PropTypes.func,
    onClickTrackCTA: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickOpenRegistrationRequestDialog: this.onClickOpenRegistrationRequestDialog,
      onClickScrollToContent: this.onClickScrollToContent,
      onClickTrackCredits: this.onClickTrackCredits,
      onClickTrackCTA: this.onClickTrackCTA,
    }
  }

  componentDidMount() {
    addGlobalDrag()
    const { dispatch, isLoggedIn } = this.props
    dispatch(trackInitialPage())
    if (isLoggedIn) {
      dispatch(loadProfile())
      dispatch(loadNotifications({ category: 'all' }))
      dispatch(loadAnnouncements())
    } else {
      dispatch(fetchAuthenticationPromos())
    }
    dispatch(getCategories())
    dispatch(getPagePromotionals())
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      dispatch(loadProfile())
      dispatch(getCategories())
      dispatch(getPagePromotionals())
      dispatch(loadAnnouncements())
    } else if (this.props.isLoggedIn && !nextProps.isLoggedIn) {
      dispatch(fetchAuthenticationPromos())
      dispatch(getCategories())
      dispatch(getPagePromotionals())
    }
  }

  shouldComponentUpdate(nextProps) {
    return ['isAuthenticationView', 'isLoggedIn', 'params', 'children'].some(prop =>
      nextProps[prop] !== this.props[prop],
    )
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  onClickOpenRegistrationRequestDialog = (trackPostfix = 'modal') => {
    const { authPromo, dispatch, isAuthenticationView } = this.props
    if (isAuthenticationView) { return }
    dispatch(openModal(
      <RegistrationRequestDialog promotional={authPromo} />,
      'asDecapitated',
      'RegistrationRequestDialog',
    ))
    dispatch(trackEvent(`open-registration-request-${trackPostfix}`))
    dispatch(setSignupModalLaunched())
  }

  onClickScrollToContent = () => {
    scrollToPosition(0, document.querySelector('.Hero').offsetHeight)
  }

  onClickTrackCredits = () => {
    const { dispatch, categoryData, isCategoryPromotion, isPagePromotion } = this.props
    let label = ''
    if (isCategoryPromotion && categoryData) {
      label = categoryData.category.get('slug')
    } else if (isPagePromotion) {
      label = 'general'
    } else {
      label = 'auth'
    }
    dispatch(trackEvent('promoByline_clicked', { name: label }))
  }

  onClickTrackCTA = () => {
    const { dispatch, categoryData } = this.props
    dispatch(trackEvent('promoCTA_clicked', { name: categoryData.category.get('slug', 'general') }))
  }

  render() {
    const { children, isAuthenticationView, isLoggedIn, params } = this.props
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <MetaContainer params={params} />
        <ViewportContainer params={params} />
        {isLoggedIn ? <OmnibarContainer /> : null}
        <HeroContainer params={params} />
        {children}
        <NavbarContainer params={params} />
        {!isAuthenticationView && <FooterContainer params={params} />}
        {isLoggedIn ? <InputContainer /> : null}
        <ModalContainer />
        <DevTools />
        <KeyboardContainer />
        <AnalyticsContainer />
      </section>
    )
  }
}

export default connect(mapStateToProps)(AppContainer)

