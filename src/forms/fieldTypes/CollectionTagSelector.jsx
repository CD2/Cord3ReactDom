import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable, reaction } from "mobx"
import TagSelector from "./TagSelector"

@observer
export default class CollectionTagSelector extends React.Component {
  static propTypes = {
    collection: PropTypes.object.isRequired,
    createFunction: PropTypes.func,
    name_attribute: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    value_attribute: PropTypes.string.isRequired,
  }

  static defaultProps = {
    value: [],
  }

  constructor(props) {
    super(props)
    this.collection = props.collection
    this.suggestionPromise = this.pluckCollection()
    if (props.value) {
      this.suggestionPromise.then(response => {
        this.initialValues = response.filter(val => props.value.includes(val[0]))
        this.loaded = true
      })
    }
  }

  componentWillMount() {
    this.cleanup = reaction(
      () => this.suggestionPromise,
      prom => {
        prom.then(values => {
          this.suggestions.set(values)
        })
      },
      true,
    )
  }

  componentWillReceiveProps(props) {
    if (props.value.length !== this.initialValues.length) {
      this.suggestionPromise = this.pluckCollection()
      this.suggestionPromise.then(() => (this.inputValue = ``))
    }
  }

  componentWillUnmount() {
    this.cleanup()
  }

  @observable inputValue = ``
  @observable initialValues = []
  @observable suggestionPromise
  @observable suggestions = observable.shallowBox([])
  @observable loaded = false
  @observable collection

  pluckCollection() {
    const { name_attribute, value_attribute } = this.props
    return this.collection.pluck(value_attribute, name_attribute)
  }

  handleValueChange = val => {
    this.inputValue = val
    this.collection = this.collection.query(val)
    this.suggestionPromise = this.pluckCollection()
  }

  handleChange = tagArr => {
    this.props.onChange(tagArr)
  }

  handleCreate = () => {
    if(this.props.createFunction){
      return (
        <span
          className="suggestions__item"
          onClick={() => this.props.createFunction(this.inputValue)}
        >
        Create: {this.inputValue}
      </span>
      )
    }
  }

  render() {
    if (!this.loaded) return `...`
    const suggestions = this.suggestions.get()
    return (
      <TagSelector
        inputValue={this.inputValue}
        options={suggestions}
        values={this.initialValues}
        renderNoResults={() => <b>No Idea, create new? {this.inputValue}</b>}
        createFunction={this.handleCreate}
        onInputChange={this.handleValueChange}
        onChange={this.handleChange}
      />
    )
  }
}
