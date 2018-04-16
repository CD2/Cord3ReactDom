import React from "react"
import PropTypes from "prop-types"
import { observable, reaction } from "mobx"
import { observer, inject } from "mobx-react"

@inject(`form`)
@observer
export default class Submit extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    submittingText: PropTypes.string,
    submittingTime: PropTypes.number,
    text: PropTypes.string,
  }

  static defaultProps = {
    submittingTime: 500,
  }

  componentDidMount() {
    const { submittingTime, form } = this.props
    reaction(
      () => form.submitting,
      () => {
        this.submittingTimeout = true
        setTimeout(() => (this.submittingTimeout = false), submittingTime)
      },
    )
  }

  get submitting() {}

  @observable submittingTimeout = false

  render() {
    const { text, submittingText, form: { record, submitting }} = this.props
    const defaultText = (record.newRecord ? `Create ` : `Update `) + record.class.displayName || record.class.name
    return (
      <input
        className={`btn submit${submitting || this.submittingTimeout ? ` submitting` : ``}`}
        type="submit"
        disabled={submitting || this.submittingTimeout}
        value={
          submitting || this.submittingTimeout
            ? submittingText || `submitting`
            : text || defaultText
        }
      />
    )
  }
}
