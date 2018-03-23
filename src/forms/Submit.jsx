import React from "react"
import PropTypes from "prop-types"
import { observable, reaction } from "mobx"
import { observer, inject } from "mobx-react"

@inject(`form`)
@observer
export default class Submit extends React.Component {
  static propTypes = {
    form: PropTypes.object,    
    submittingTime: PropTypes.number,
    text: PropTypes.string,
  }

  static defaultProps = {
    submittingTime: 500,
  }

  componentWillMount() {
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
    const { text, form: { record, submitting }} = this.props
    const defaultText = (record.newRecord ? `Create ` : `Update `) + record.class.name
    if (submitting || this.submittingTimeout) return `submitting`
    return <input className="btn submit" type="submit" value={text || defaultText} />
  }
}
