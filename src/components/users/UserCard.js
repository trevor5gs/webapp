import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { selectIsLoggedIn } from '../../selectors/authentication'
import { selectPropsUserId, selectRelationshipPriority } from '../../selectors/user'
import { selectPathname } from '../../selectors/routing'
import { openModal } from '../../actions/modals'
import { updateRelationship } from '../../actions/relationships'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import RelationshipImageButton from '../relationships/RelationshipImageButton'

function mapStateToProps(state, props) {
  const { json } = state
  const userId = selectPropsUserId(state, props)
  return {
    isLoggedIn: selectIsLoggedIn(state),
    pathname: selectPathname(state),
    relationshipPriority: selectRelationshipPriority(state, props),
    user: userId ? json[MAPPING_TYPES.USERS][userId] : null,
  }
}

class UserCard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    user: PropTypes.shape({
    }).isRequired,
    relationshipPriority: PropTypes.string,
  }

  onClickRelationshipUpdate = (vo) => {
    const { userId, priority, existing } = vo
    const { dispatch, pathname } = this.props

    if (pathname && (/^\/onboarding/).test(pathname)) {
      dispatch(updateRelationship(userId, priority, existing, true))
      return
    }
    dispatch(updateRelationship(userId, priority, existing))
  }

  onClickOpenSignupModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'isDecapitated'))
  }

  render() {
    const { isLoggedIn, relationshipPriority, user } = this.props
    const callback = isLoggedIn ? this.onClickRelationshipUpdate : this.onClickOpenSignupModal
    return (
      <div className="UserCard" >
        <RelationshipImageButton
          coverSrc={user.coverImage.hdpi.url}
          isLoggedIn={isLoggedIn}
          onClick={callback}
          priority={relationshipPriority}
          userId={user.id}
          username={`@${user.username}`}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(UserCard)

