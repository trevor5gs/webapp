import React from 'react'

class FormControl extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { text, hasFocus } = this.props
    this.state = {
      text: text,
      hasValue: text.length,
      hasFocus: hasFocus,
    }
  }


  handleChange(e) {
    const val = e.target.value
    this.setState({ text: val, hasValue: val.length })
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }
}

FormControl.defaultProps = {
  hasFocus: false,
  text: '',
}

FormControl.propTypes = {
  hasFocus: React.PropTypes.bool,
  text: React.PropTypes.string,
}
export default FormControl

