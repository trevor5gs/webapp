import React, { PropTypes } from 'react'
import classNames from 'classnames'
import ToggleControl from '../forms/ToggleControl'

const Preference = ({ className, definition, id, isChecked, isDisabled, onToggleChange }) =>
  <form className={ classNames(className, 'Preference') }>
    <dl>
      <dt>{definition.term ? definition.term : ''}</dt>
      <dd dangerouslySetInnerHTML={{ __html: definition.desc ? definition.desc : '' }} />
    </dl>
    <ToggleControl
      id={ id }
      isChecked={ isChecked }
      isDisabled={ isDisabled }
      onChange={ onToggleChange }
    />
  </form>

Preference.propTypes = {
  definition: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onToggleChange: PropTypes.func,
}

export default Preference

