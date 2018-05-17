import React from "react"
import { observer } from "mobx-react"
import { observable, reaction, computed } from "mobx"
import invariant from "invariant"
import PropTypes from "prop-types"

@observer
export default class ComponentWithRecord extends React.Component {
  static propTypes = {
    id: PropTypes.number,
  }
  constructor(...args) {
    super(...args)

    this._render = this.render
    this.render = this.mainRender
  }

  componentDidMount() {
    invariant(this.Model !== undefined, `Model must be set`)
    invariant(this.id !== undefined, `ID must be set`)
    this.getRecord()

    reaction(() => this.id, () => this.getRecord(), true)
  }


  @observable errored = false
  @observable record

  @computed
  get id() {
    return this._id || this.props.id
  }

  set id(val) {
    this._id = val
  }

  async getRecord() {
    this.record = null

    this.Model.find(this.id)
      .then(record => {
        this.record = record
      })
      .catch(error => {
        this.errored = true
        throw error
      })
 
    this.afterLookup && this.afterLookup(this.record)
  }

  renderLoading() {
    return this.loadingContent ? this.loadingContent() : `...`
  }

  mainRender() {
    if (this.Model && !this.record) return this.renderLoading()
    return this._render()
  }
}
