import React from 'react'
import PropTypes from "prop-types"
import { observable, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'

@inject(`form`)
@observer
export default class Submit extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    text: PropTypes.string,
    submittingTime: PropTypes.number
  }

  static defaultProps = {
    submittingTime: 500
  }

  @observable submittingTimeout = false

  get submitting() {

  }

  componentWillMount() {
    const { submittingTime, form:{ submitting }} = this.props
    reaction(() => this.props.form.submitting, () => {
      this.submittingTimeout = true
      setTimeout(() => this.submittingTimeout = false, submittingTime)
    })
  }



  render() {
    console.log('THISasdsad')
    const { text, form: { record, submitting }} = this.props
    const defaultText = (record.newRecord ? `Create ` : `Update `) + record.class.name
    if (submitting || this.submittingTimeout) return `submitting`
    console.log('asd')
    return (
      <input className='cord-submit' type="submit" value={text || defaultText} />
    )
  }

}
