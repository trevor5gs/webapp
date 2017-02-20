/* eslint-disable react/no-danger */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { camelize } from 'humps'
import classNames from 'classnames'
import { selectIsOnboardingView } from '../../selectors/routing'
import ToggleControl from '../forms/ToggleControl'
import { profilePath } from '../../networking/api'

const Preference = (props) => {
  const { className, definition, id, isChecked, isDisabled, isOnboarding, onToggleChange } = props
  return (
    <form action={profilePath().path} className={classNames(className, 'Preference')} method="POST">
      <dl>
        <dt>{definition.term ? definition.term : ''}</dt>
        <dd dangerouslySetInnerHTML={{ __html: definition.desc ? definition.desc : '' }} />
      </dl>
      <ToggleControl
        id={id}
        isChecked={isChecked}
        isDisabled={isDisabled}
        hasIcon={isOnboarding}
        onChange={onToggleChange}
      />
    </form>
  )
}

Preference.propTypes = {
  className: PropTypes.string,
  definition: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isOnboarding: PropTypes.bool.isRequired,
  onToggleChange: PropTypes.func.isRequired,
}
Preference.defaultProps = {
  className: null,
  isChecked: false,
  isDisabled: false,
}

function mapStateToProps(state, ownProps) {
  return {
    isChecked: state.profile.get(camelize(ownProps.id)),
    isDisabled: !state.profile.get('isPublic') && ownProps.id === 'has_sharing_enabled',
    isOnboarding: selectIsOnboardingView(state),
  }
}

export default connect(mapStateToProps)(Preference)

