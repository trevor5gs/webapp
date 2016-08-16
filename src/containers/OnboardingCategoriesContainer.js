import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get } from 'lodash'
import OnboardingCategories from '../components/onboarding/OnboardingCategories'
import { getCategories } from '../actions/discover'
import { followCategories } from '../actions/user'
import { selectCategories } from '../selectors'

const CATEGORIES_NEEDED = 3

function mapStateToProps(state, props) {
  const catLevels = selectCategories(state, props)
  return {
    categories: catLevels.primary.concat(catLevels.secondary, catLevels.tertiary),
    userId: `${get(state, 'profile.id')}`,
  }
}

class OnboardingCategoriesContainer extends Component {

  static propTypes = {
    categories: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func.isRequired,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      nextLabel: 'Create Your Profile',
      onDoneClick: this.onDoneClick,
      onNextClick: this.onNextClick,
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getCategories())
    this.categoryIds = []
    this.state = { categoryIds: [] }
  }

  onCategoryClick = (id) => {
    const index = this.categoryIds.indexOf(id)
    if (index === -1) {
      this.categoryIds.push(id)
    } else {
      this.categoryIds.splice(index, 1)
    }
    this.setState({ categoryIds: this.categoryIds })
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(push('/following'))
  }

  onNextClick = () => {
    const { dispatch, userId } = this.props
    dispatch(followCategories(userId, this.state.categoryIds))
    dispatch(push('/onboarding/settings'))
  }

  render() {
    const { categories } = this.props
    const { categoryIds } = this.state
    const selected = categoryIds.length < CATEGORIES_NEEDED ? categoryIds.length : CATEGORIES_NEEDED
    const counterText = `${selected} of ${CATEGORIES_NEEDED}`
    return (
      <OnboardingCategories
        categories={categories}
        counterText={counterText}
        isCounterSuccess={selected === CATEGORIES_NEEDED}
        onCategoryClick={this.onCategoryClick}
      />
    )
  }
}

export default connect(mapStateToProps)(OnboardingCategoriesContainer)

