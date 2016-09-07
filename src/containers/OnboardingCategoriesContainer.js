import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { isEqual, pick } from 'lodash'
import OnboardingCategories from '../components/onboarding/OnboardingCategories'
import { ONBOARDING_VERSION } from '../constants/application_types'
import { trackEvent } from '../actions/analytics'
import { getCategories } from '../actions/discover'
import { followCategories, saveProfile } from '../actions/profile'
import { selectCategories } from '../selectors'

const CATEGORIES_NEEDED = 3

function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  const pickProps = ['categories']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare) || !isEqual(thisState, nextState)
}

function mapStateToProps(state, props) {
  const catLevels = selectCategories(state, props)
  return {
    categories: catLevels.primary.concat(catLevels.secondary, catLevels.tertiary),
  }
}

function hasSelectedCategoriesNeeded(state) {
  return state.categoryIds.length < CATEGORIES_NEEDED
}

class OnboardingCategoriesContainer extends Component {

  static propTypes = {
    categories: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { categoryIds } = this.state
    let nextLabel = ''
    if (CATEGORIES_NEEDED > categoryIds.length) {
      nextLabel = `Pick ${CATEGORIES_NEEDED - categoryIds.length}`
    } else {
      nextLabel = 'Create Your Profile'
    }
    return {
      nextLabel,
      onDoneClick: hasSelectedCategoriesNeeded(this.state) ? null : this.onDoneClick,
      onNextClick: this.onNextClick,
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getCategories())
    this.state = { categoryIds: [] }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldContainerUpdate(this.props, nextProps, this.state, nextState)
  }

  onCategoryClick = (id) => {
    const ids = [...this.state.categoryIds]
    const index = ids.indexOf(id)
    if (index === -1) {
      ids.push(id)
    } else {
      ids.splice(index, 1)
    }
    this.setState({ categoryIds: ids })
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(saveProfile({ web_onboarding_version: ONBOARDING_VERSION }))
    dispatch(followCategories(this.state.categoryIds))
    dispatch(trackEvent('Onboarding.Categories.Done.Clicked'))
    dispatch(push('/following'))
  }

  onNextClick = () => {
    const { dispatch } = this.props
    dispatch(saveProfile({ web_onboarding_version: ONBOARDING_VERSION }))
    dispatch(followCategories(this.state.categoryIds))
    dispatch(push('/onboarding/settings'))
  }

  render() {
    const { categories } = this.props
    const isNextDisabled = hasSelectedCategoriesNeeded(this.state)
    return (
      <OnboardingCategories
        categories={categories}
        isNextDisabled={isNextDisabled}
        onCategoryClick={this.onCategoryClick}
      />
    )
  }
}

export default connect(mapStateToProps)(OnboardingCategoriesContainer)

