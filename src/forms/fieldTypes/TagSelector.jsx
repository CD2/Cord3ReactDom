import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable, computed, toJS, reaction, action } from "mobx"
import BasicInput from "./BasicInput"

@observer
export default class TagSelector extends React.Component {
  static propTypes = {
    inputValue: PropTypes.string,
    options: PropTypes.array,
    values: PropTypes.object,
  }

  static defaultProps = {
    inputValue: ``,
  }

  @computed
  get suggestions() {
    if (this.props.inputValue === ``) return []
    return this.props.options.filter(opt => {
      return (
        opt[1].toLowerCase().indexOf(this.props.inputValue.toLowerCase()) > -1 &&
        !this.selected.map(x => x[0]).includes(opt[0])
      )
    })
  }

  componentWillMount() {
    this.inputValue = this.props.inputValue || ``
    reaction(
      () => this.inputValue,
      val => {
        if (this.props.onInputChange) this.props.onInputChange(val)
      },
    )

    this.selected = this.props.values || []
    reaction(
      () => this.selected.length,
      values => {
        this.props.onChange(this.selected.map(val => val[0]))
      },
    )
  }

  componentWillReceiveProps(props) {
    if (this.selected.length !== props.values.length) this.selected = props.values || []
    if (this.inputValue !== props.inputValue) this.inputValue = props.inputValue
  }

  @observable inputValue = ``
  @observable selected = []

  @action
  handleChange = val => {
    this.inputValue = val
  }

  @action
  handleAddSuggestion(suggestion) {
    if (!this.selected.map(x => x[0]).includes(suggestion[0])) {
      this.selected.push(suggestion)
    }
    this.inputValue = ``
  }

  @action
  handleRemoveSuggestion(sugg) {
    const newSelected = this.selected.filter(el => el[0] !== sugg)
    this.selected.replace(newSelected)
  }

  renderSelected() {
    if (this.selected.length === 0) return null
    return (
      <div>
        {this.selected.map(sel => (
          <span
            key={sel}
            className="selected-item"
            onClick={this.handleRemoveSuggestion.bind(this, sel[0])}
          >
            {sel[1]} X
          </span>
        ))}
      </div>
    )
  }

  renderSuggestions() {
    if (this.props.inputValue.length === 0) return null
    return (
      <div className="suggestions">
        {this.suggestions.map(suggestion => (
          <span
            key={suggestion}
            className="suggestions__item"
            onClick={this.handleAddSuggestion.bind(this, suggestion)}
          >
            {suggestion[1]}
          </span>
        ))}
        {
          // this.props.renderNoResults && this.props.renderNoResults()
        }
        {this.props.createFunction && this.props.createFunction()}
      </div>
    )
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.renderSelected()}
        <BasicInput
          placeholder={this.props.placeholder || `Type for suggestions...`}
          value={this.inputValue}
          onChange={this.handleChange}
        />
        {this.renderSuggestions()}
      </div>
    )
  }
}
