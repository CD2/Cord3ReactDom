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
    autorun(() => {
      this.id
      this.getRecord()
    })
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

  afterLookup() {
    // Overwrite
  }

  async getRecord() {
    this.record = null

    await this.Model.find(this.id).
      then(record => {
        this.record = record
        this.afterLookup(this.record)
      }).
      catch(error => {
        this.errored = true
        throw error
      })
  }

  // Overwrite this in the child component to dictate the loading
  renderLoading() {
    return `...`
  }

  renderErrored() {
    if (this.errorComponent) return <this.errorComponent />
    if (this.errorContent) return this.errorContent
    return `...`
  }

  mainRender() {
    if (this.Model && !this.record) {
      return this.errored ? this.renderErrored() : this.renderLoading()
    }
    return this._render()
  }
}
