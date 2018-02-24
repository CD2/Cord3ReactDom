import React from "react"
import { observable, reaction } from "mobx"
import { observer } from "mobx-react"

@observer
export default class CordTable extends React.Component {
  // static propTypes = {
  //   collection: PropTypes.object,
  //   renderRow: PropTypes.func,
  //   renderHead: PropTypes.func,
  // }

  @observable recordsPromise
  @observable records = []
  @observable loading = false
  @observable loaded = false

  componentWillMount() {
    const { collection } = this.props
    this.cleanup = collection.onChange(this.handleCollectionChange)
    this.recordsPromise = collection.toArray()

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

  handleCollectionChange = async () => {
    this.loading = true
    this.records = await this.props.collection.toArray()
    this.loading = false
  }

  componentWillUnmount() {
    this.cleanup()
  }

  render() {
    const { renderRow, renderHead, collection } = this.props
    if (this.records.length === 0)
      return <div className={`${this.props.className} no-results`}>No entries</div>
    return (
      <React.Fragment>
        {this.loading + ""}
        <table className={this.props.className}>
          <thead>{renderHead()}</thead>
          <tbody>{this.records.map(renderRow)}</tbody>
        </table>
      </React.Fragment>
    )
  }
}
