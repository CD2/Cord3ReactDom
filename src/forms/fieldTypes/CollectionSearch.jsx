import React from "react"
import PropTypes from "prop-types"
import { observable } from "mobx"
import { observer } from "mobx-react"
import BasicInput from "./BasicInput"

@observer
export default class CollectionSelectField extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    collection: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.string,
  }

  @observable inputValue = this.props.initialValue
  @observable loaded = false
  @observable active = false

  handleChange = val => {
    this.inputValue = val
  }

  focusInput = () => {
    this.active = true
  }
  unFocusInput = () => {
    this.active = false
  }
  chooseValue = (val) => {
    this.props.onSelect && this.props.onSelect(val)
    this.props.blankAfterSelect ? this.inputValue = '' : this.inputValue = val[1]
  }

  constructor(props) {
    super(props)
    this.setupChoices()
  }

  async setupChoices() {
    const { name_attribute, value_attribute, collection } = this.props
    this.choices = await collection.pluck(value_attribute, name_attribute)
    if (this.choices) this.loaded = true
  }

  componentWillReceiveProps(props){
    if (this.props.initialValue !== props.initialValue) this.inputValue = props.initialValue
  }

  renderSuggestions() {
    if (!this.active) return null
    return (
      <div className="suggestions">
        {this.choices.map(choice => (
          <span
            key={choice}
            className="suggestions__item"
            onMouseDown={() => this.chooseValue(choice)
            }
          >
            {choice[1]}
          </span>
        ))}
        {
          // this.props.renderNoResults && this.props.renderNoResults()
        }
      </div>
    )
  }

  render() {
    const { onChange, value, defaultValue, className } = this.props
    if (!this.loaded) return "LOADING!"
    return (
      <div className={className}>
        <BasicInput
          placeholder={this.props.placeholder || `Type for suggestions...`}
          value={this.inputValue || ''}
          onChange={this.handleChange}
          onFocus={this.focusInput}
          onBlur={this.unFocusInput}
        />
        {this.renderSuggestions()}
      </div>
    )
  }
}