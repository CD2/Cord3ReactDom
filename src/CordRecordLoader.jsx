import React from "react"
import { observer } from "mobx-react"
import { observable, reaction, computed } from "mobx"
import invariant from "invariant"

@observer
export default class CordReactComponent extends React.Component {
  constructor(...args) {
    super(...args)

    this._render = this.render
    this.render = this.mainRender
  }

  @computed
  get id() {
    return this._id || this.props.id
  }
  set id(val) {
    this._id = val
  }

  componentDidMount() {
    invariant(this.Model !== undefined, `Model must be set`)
    invariant(this.id !== undefined, `ID must be set`)

    reaction(() => this.id, () => this.getRecord(), true)
  }

  async getRecord() {
    this.record = await this.Model.find(this.id)
  }

  @observable record

  mainRender() {
    if (this.Model && !this.record) return `Loading...`
    return this._render()
  }
}
