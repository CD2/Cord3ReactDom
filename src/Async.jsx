import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable } from "mobx"

const makeCancelable = promise => {
  let hasCanceled_ = false

  const wrappedPromise = new Promise((resolve, reject) => {
    Promise.resolve(promise).then(
      val => (hasCanceled_ ? undefined : resolve(val)),
      error => (hasCanceled_ ? undefined : reject(error)),
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    },
  }
}

@observer
export default class Async extends React.Component {
  static propTypes = {
    catch: PropTypes.func,
    loading: PropTypes.func,
    promise: PropTypes.func,
    then: PropTypes.func,
  }

  static defaultProps = {
    loading: () => {
      return null
    },
    then: () => {
      return null
    },
    catch: () => {
      return null
    },
  }
  @observable state = {
    loading: true,
    loaded: false,
    errored: false,
    result: null,
  }
  componentDidMount() {
    this.prom = makeCancelable(this.props.promise)
    this.prom.promise.
      then(result => this.state({ result, loading: false, loaded: true })).
      catch(error => this.state({ errored: true, loading: false, result: error }))
  }
  componentWillUnmount() {
    this.prom.promise.catch(e => console.error(e))
    if (this.prom) this.prom.cancel()
  }

  render() {
    const { loading, loaded, errored, result } = this.state
    if (loaded) return this.props.then(result)
    if (errored) return this.props.catch(result)
    if (loading) return this.props.loading()
    return null
  }
}
