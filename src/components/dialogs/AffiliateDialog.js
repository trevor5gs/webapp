import React, { Component, PropTypes } from 'react'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import TextControl from '../forms/TextControl'
import { isValidURL } from '../forms/Validators'

class AffiliateDialog extends Component {

  componentWillMount() {
    this.value = this.props.text
    this.state = { status: STATUS.INDETERMINATE }
    this.updateStatus({ affiliateLink: this.value || '' })
  }

  onClickSubmit = () => {
    if (this.value.indexOf('http') !== 0) {
      this.value = `http://${this.value}`
    }
    this.props.onConfirm({ value: this.value })
  }

  onClickReset = () => {
    this.props.onConfirm({ value: null })
  }

  onChangeControl = ({ affiliateLink }) => {
    this.updateStatus({ affiliateLink })
    this.value = affiliateLink
  }

  updateStatus({ affiliateLink }) {
    const isValid = isValidURL(affiliateLink)
    const { urlStatus } = this.state
    if (isValid && urlStatus !== STATUS.SUCCESS) {
      this.setState({ urlStatus: STATUS.SUCCESS })
    } else if (!isValid && urlStatus !== STATUS.INDETERMINATE) {
      this.setState({ urlStatus: STATUS.INDETERMINATE })
    }
  }

  render() {
    const { onDismiss, text } = this.props
    const { urlStatus } = this.state
    return (
      <div className="Dialog AffiliateDialog">
        <h2 className="AffiliateDialogTitle">Sell your work</h2>
        <TextControl
          classList="asBoxControl AffiliateDialogControl"
          id="affiliateLink"
          label="Product detail URL"
          name="affiliate[productDetail]"
          onChange={this.onChangeControl}
          placeholder="Product detail URL"
          status={urlStatus}
          tabIndex="1"
          text={text}
        />
        <button
          className="AffiliateDialogButton isSubmit"
          onClick={this.onClickSubmit}
          disabled={!(urlStatus === STATUS.SUCCESS)}
        >
          {text && text.length ? 'Update' : 'Submit'}

        </button>
        {text && text.length ?
          <button
            className="AffiliateDialogButton isRemove"
            onClick={this.onClickReset}
          >
            Remove
          </button> :
          null
        }
        <button className="AffiliateDialogButton" onClick={onDismiss}>Cancel</button>
      </div>
    )
  }
}

AffiliateDialog.propTypes = {
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
  text: PropTypes.string,
}

export default AffiliateDialog

