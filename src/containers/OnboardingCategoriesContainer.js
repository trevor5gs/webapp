import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { isEqual, pick } from 'lodash'
import OnboardingCategories from '../components/onboarding/OnboardingCategories'
import { ONBOARDING_VERSION } from '../constants/application_types'
import { getCategories } from '../actions/discover'
import { saveProfile } from '../actions/profile'
import { followCategories } from '../actions/user'
import { selectCategories } from '../selectors'
import { selectCreatedAt, selectId } from '../selectors/profile'

const CATEGORIES_NEEDED = 3
const MS_IN_WEEK = 604800 * 1000

function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  const pickProps = ['categories', 'userId']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare) || !isEqual(thisState, nextState)
}

function mapStateToProps(state, props) {
  const catLevels = selectCategories(state, props)
  return {
    categories: catLevels.primary.concat(catLevels.secondary, catLevels.tertiary),
    createdAt: selectCreatedAt(state),
    userId: `${selectId(state)}`,
  }
}

function isMoreThanOneWeekOld(createdAt) {
  return new Date() - new Date(createdAt) > MS_IN_WEEK
}

function hasSelectedCategoriesNeeded(state) {
  return state.categoryIds.length < CATEGORIES_NEEDED
}

function getIsNextDisabled(state, createdAt) {
  if (isMoreThanOneWeekOld(createdAt)) { return false }
  return hasSelectedCategoriesNeeded(state)
}

class OnboardingCategoriesContainer extends Component {

  static propTypes = {
    categories: PropTypes.array,
    createdAt: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      nextLabel: 'Create Your Profile',
      onDoneClick: getIsNextDisabled(this.state, this.props.createdAt) ? null : this.onDoneClick,
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
    dispatch(push('/following'))
  }

  onNextClick = () => {
    const { dispatch, userId } = this.props
    dispatch(saveProfile({ web_onboarding_version: ONBOARDING_VERSION }))
    dispatch(followCategories(userId, this.state.categoryIds))
    dispatch(push('/onboarding/settings'))
  }

  render() {
    const { categories, createdAt } = this.props
    const { categoryIds } = this.state
    const isNextDisabled = getIsNextDisabled(this.state, createdAt)
    const selected = isNextDisabled ? categoryIds.length : CATEGORIES_NEEDED
    const counterText = `${selected} of ${CATEGORIES_NEEDED}`
    return (
      <OnboardingCategories
        categories={categories}
        counterText={counterText}
        isCounterSuccess={selected === CATEGORIES_NEEDED}
        isNextDisabled={isNextDisabled}
        onCategoryClick={this.onCategoryClick}
      />
    )
  }
}

export default connect(mapStateToProps)(OnboardingCategoriesContainer)

