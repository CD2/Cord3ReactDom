import React from "react"
import { observable, reaction } from "mobx"
import { observer } from "mobx-react"
import PropTypes from "prop-types"

@observer
export default class CordCollection extends React.Component {
  static propTypes = {
    collection: PropTypes.object,
  }

  componentWillMount() {
    const { collection } = this.props
    this.cleanup = collection && collection.onChange(this.handleCollectionChange)
    this.recordsPromise = collection && collection.toArray()

    reaction(
      () => this.recordsPromise,
      async prom => {
        this.records = await prom
        this.loaded = true
      },
      true,
    )
  }

  componentWillReceiveProps(props) {
    if (this.props.collection !== props.collection) this.recordsPromise = props.collection.toArray()
  }

  componentWillUnmount() {
    this.cleanup && this.cleanup()
  }

  @observable recordsPromise
  @observable records = []
  @observable loading = false
  @observable loaded = false

  handleCollectionChange = async () => {
    this.loading = true
    this.records = await this.props.collection.toArray()
    this.loading = false
  }

  render() {
    return <React.Fragment>Overwrite this render method</React.Fragment>
  }
}

export class CordTable extends CordCollection {
  render() {
    const { renderRow, renderHead } = this.props
    if (!this.loaded || !this.records) return this.props.loadingContent || `LOADING...`
    if (this.records.length === 0) {
      return <div className={`${this.props.className} no-results`}>No entries</div>
    }
    return (
      <React.Fragment>
        <table className={`${this.props.className}${this.loading ? ` loading` : ``}`}>
          <thead>{renderHead()}</thead>
          <tbody>{this.records.map(renderRow)}</tbody>
        </table>
      </React.Fragment>
    )
  }
}
