import React from 'react'
import { redirect } from "lib/utils/router"
import { observer } from 'mobx-react'
import { observable } from 'mobx'


@observer
export default class CordReactComponent extends React.Component {
  constructor(...args) {
    super(...args)

    this._render = this.render
    this.render = this.mainRender

  }

  componentDidMount() {
    if(this.Model){
      this.lookupId = this.id || this.props.id
      if(!this.lookupId) throw new Error('No ID sent')
      this.getRecord(this.lookupId)
    }
  }

  async componentWillReceiveProps(props) {
    if(this.Model) {
      if (props.id && (props.id !== this.lookupId)) this.getRecord(props.id)
    }
  }

  async getRecord(id) {
    this.record = await this.Model.find(id)
  }

  @observable record

  mainRender() {
    if (this.Model && !this.record) return 'Loading...'
    return this._render()
  }
}
