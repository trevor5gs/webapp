import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import { selectIsLoggedIn } from '../selectors/authentication'
import { trackEvent } from '../actions/analytics'
import { getCategories, getPagePromotionals } from '../actions/discover'
import { setSignupModalLaunched } from '../actions/gui'
import { openModal } from '../actions/modals'
import { loadNotifications } from '../actions/notifications'
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
import { selectIsCategoryPromotion, selectIsPagePromotion, selectRandomAuthPromotion } from '../selectors/promotions'
import { scrollTo } from '../lib/jello'

function mapStateToProps(state) {
  return {
    authPromo: selectRandomAuthPromotion(state),
    isCategoryPromotion: selectIsCategoryPromotion(state),
    isLoggedIn: selectIsLoggedIn(state),
    isPagePromotion: selectIsPagePromotion(state),
  }
}

class AppContainer extends Component {

  static propTypes = {
    authPromo: PropTypes.object,
    categoryData: PropTypes.object,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    isCategoryPromotion: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isPagePromotion: PropTypes.bool,
    params: PropTypes.object.isRequired,
  }

  static preRender = (store) => {
    const state = store.getState()
    if (state.authentication && state.authentication.isLoggedIn) {
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
  }

  getChildContext() {
    return {
      onClickOpenRegistrationRequestDialog: this.onClickOpenRegistrationRequestDialog,
      onClickScrollToContent: this.onClickScrollToContent,
      onClickTrackCredits: this.onClickTrackCredits,
    }
  }

  componentDidMount() {
    addGlobalDrag()
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) {
      dispatch(loadProfile())
      dispatch(loadNotifications({ category: 'all' }))
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
    } else if (this.props.isLoggedIn && !nextProps.isLoggedIn) {
      dispatch(fetchAuthenticationPromos())
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  onClickOpenRegistrationRequestDialog = (trackPostfix = 'modal') => {
    const { authPromo, dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog promotional={authPromo} />, 'asDecapitated'))
    dispatch(trackEvent(`open-registration-request-${trackPostfix}`))
    dispatch(setSignupModalLaunched())
  }

  onClickScrollToContent = () => {
    scrollTo(0, document.querySelector('.Hero').offsetHeight)
  }

  onClickTrackCredits = () => {
    const { dispatch, categoryData, isCategoryPromotion, isPagePromotion } = this.props
    let label = 'promoByline_clicked_'
    if (isCategoryPromotion && categoryData) {
      label += categoryData.category.slug
    } else if (isPagePromotion) {
      label += 'general'
    } else {
      label += 'auth'
    }
    dispatch(trackEvent(label))
  }

  render() {
    const { children, isLoggedIn, params } = this.props
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
        <FooterContainer />
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

