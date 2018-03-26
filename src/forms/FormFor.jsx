import React from "react"
import PropTypes from "prop-types"
import { Provider } from "mobx-react"
import { observable, action } from "mobx"
import { observer } from "mobx-react"

@observer
export default class FormFor extends React.Component {
  static DEFAULT_AUTOSAVE_TIME = 5000

  static propTypes = {
    afterErrored: PropTypes.func,
    afterSubmit: PropTypes.func,
    allowDangourousAutoSaveTime: PropTypes.bool,
    autosave: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    children: PropTypes.node,
    record: PropTypes.object.isRequired,
  }

  static defaultProps = {
    afterSubmit: () => {},
  }

  componentDidMount() {
    const { record } = this.props
    if (record.persisted) {
      const time = this.autosaveTime
      if (time) this.autosaveTimer = setInterval(this.autosave, time)
    }
  }

  componentWillReceiveProps(props) {
    if (props.record !== this.props.record && this._formObj) {
      this._formObj.record = props.record
    }
  }

  componentWillUnmount() {
    if (this.autosaveTimer) clearInterval(this.autosaveTimer)
  }

  @observable submitting = false

  get autosaveTime() {
    const { autosave, allowDangourousAutoSaveTime } = this.props
    if (typeof autosave === `boolean`) return this.constructor.DEFAULT_AUTOSAVE_TIME
    if (!allowDangourousAutoSaveTime && autosave < 1000) {
      throw new Error(
        `Autosave cannot be below 1 second. To override this pass an additional prop of \`allowDangourousAutoSaveTime\``,
      )
    }
    return autosave
  }

  autosave = () => {
    this.save()
  }

  get formObj() {
    if (!this._formObj) {
      this._formObj = observable({
        record: this.props.record,
        submitting: this.submitting,
      })
    }
    return this._formObj
  }

  @action
  async save() {
    if (this.submitting) return
    this.submitting = true
    this.formObj.submitting = true
    const saved = await this.props.record.save()
    this.submitting = false
    this.formObj.submitting = false
    return saved
  }

  handleSubmit = async e => {
    e.preventDefault()
    const saved = await this.save()
    if (saved) {
      this.props.afterSubmit()
    } else {
      this.props.afterErrored && this.props.afterErrored()
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider form={this.formObj}>
        <form onSubmit={this.handleSubmit}>
          {this.saving && <div>Saving</div>}
          {children}
        </form>
      </Provider>
    )
  }
}
