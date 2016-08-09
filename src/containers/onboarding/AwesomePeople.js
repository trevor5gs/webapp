/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as ACTION_TYPES from '../../constants/action_types'
import { loadAwesomePeople, relationshipBatchSave } from '../../actions/onboarding'
import { batchUpdateRelationship } from '../../actions/relationships'
import { trackEvent } from '../../actions/tracking'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../../components/views/MainView'

class AwesomePeople extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    following: PropTypes.array.isRequired,
    inactive: PropTypes.array.isRequired,
    followAll: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    if (!this.hasAutoFollowed && nextProps.followAll && nextProps.inactive.length > 0) {
      this.hasAutoFollowed = true
      const userIds = this.getUserIds()
      if (userIds.length) {
        dispatch(batchUpdateRelationship(userIds, 'friend'))
      }
    }
  }

  onClickNext = () => {
    const { dispatch, following, inactive } = this.props
    // Save any relationships created...
    if (!following.length && !inactive.length) { return }
    dispatch(trackEvent('completed-people-picker'))

    const followingLength = following.length
    const inactiveLength = inactive.length
    if (followingLength) {
      const followingIds = following.map((user) => user.id)
      this.batchSave(followingIds, 'friend')
    }
    if (inactiveLength) {
      const inactiveIds = inactive.map((user) => user.id)
      this.batchSave(inactiveIds, 'inactive')
    }

    if (followingLength > 0 && inactiveLength === 0) {
      dispatch(trackEvent('followed-all-people-picker'))
    } else if (followingLength === 0 && inactiveLength > 0) {
      dispatch(trackEvent('unfollowed-all-people-picker'))
    } else {
      dispatch(trackEvent('followed-some-people-picker'))
    }
    dispatch(push('/onboarding/profile-header'))
  }

  onClickSkip = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('skipped-people-picker'))
    dispatch(push('/onboarding/profile-header'))
  }

  getUserIds() {
    return this.streamContainer && this.streamContainer.refs.wrappedInstance.props.result ?
      this.streamContainer.refs.wrappedInstance.props.result.ids :
      []
  }

  followAll = () => {
    const { dispatch, inactive } = this.props
    const relationship = inactive.length === 0 ?
      RELATIONSHIP_PRIORITY.INACTIVE :
      RELATIONSHIP_PRIORITY.FRIEND
    const userIds = this.getUserIds()
    if (userIds.length) {
      dispatch(batchUpdateRelationship(userIds, relationship))
    }
  }

  isFollowingAll() {
    const { following, inactive } = this.props
    return following.length > 1 && inactive.length === 0
  }

  batchSave = (ids, priority) => {
    const { dispatch } = this.props
    dispatch(relationshipBatchSave(ids, priority))
  }

  renderBigButtonText() {
    const { following, inactive } = this.props
    const followingLength = following.length
    const inactiveLength = inactive.length
    if (followingLength === 0 && inactiveLength === 0) {
      return ''
    } else if (followingLength === 0) {
      return `Follow All (${inactiveLength})`
    }
    return `Following (${followingLength})`
  }

  render() {
    const { following } = this.props
    const userIds = this.getUserIds()
    return (
      <MainView className="PeoplePicker">
        <OnboardingHeader
          title="Follow some awesome people."
          message="Ello is full of interesting and creative people committed to building a positive community."
          isNextDisabled={!following.length}
          nextAction={this.onClickNext}
          skipAction={this.onClickSkip}
        />
        <div className={classNames({ isFollowingAll: this.isFollowingAll() })}>
          {
            userIds.length ?
              <button className="PickerButton" onClick={this.followAll}>
                <span>{this.renderBigButtonText()}</span>
              </button> :
              null
          }
          <StreamContainer ref={(comp) => { this.streamContainer = comp }} action={loadAwesomePeople()} />
        </div>
      </MainView>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const result = state.json.pages ? state.json.pages[state.routing.location.pathname] : null
  const relationshipMap = { following: [], inactive: [] }
  if (result && result.type && result.ids) {
    for (const id of result.ids) {
      const model = state.json[result.type][id]
      switch (model.relationshipPriority) {
        case 'friend':
        case 'noise':
          relationshipMap.following.push(model)
          break
        default:
          relationshipMap.inactive.push(model)
          break
      }
    }
  }
  return {
    following: relationshipMap.following,
    inactive: relationshipMap.inactive,
    profile: state.profile,
    followAll: state.stream.type && state.stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS,
    type: ownProps.params.type,
  }
}

export default connect(mapStateToProps)(AwesomePeople)

