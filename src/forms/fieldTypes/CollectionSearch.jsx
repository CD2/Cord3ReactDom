import React from "react"
import PropTypes from "prop-types"
import { observable, reaction, computed } from "mobx"
import { observer } from "mobx-react"
import BasicInput from "./BasicInput"

@observer
export default class CollectionSelectField extends React.Component {
  static propTypes = {
    blankAfterSelect: PropTypes.bool,
    className: PropTypes.string,
    collection: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    initialValue: PropTypes.any,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onChooseValue: PropTypes.func,
    onSelect: PropTypes.func,
    placeholder: PropTypes.any,
    value: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.setupChoices()
  }

  componentDidMount() {
    reaction(
      () => this.inputValue,
      val => {
        this.filterList(val)
      },
    )
  }

  componentWillReceiveProps(props) {
    if (this.props.initialValue !== props.initialValue) this.inputValue = props.initialValue
  }

  async setupChoices() {
    const { name_attribute, value_attribute, collection } = this.props
    this.choices = await collection.pluck(value_attribute, name_attribute)
    if (this.choices) this.loaded = true
  }

  @observable inputValue = this.props.initialValue
  @observable loaded = false
  @observable active = false
  @observable choices = this.choices
  @observable filteredChoices = []

  filterList() {
    if (this.inputValue && this.inputValue.length > 0) {
      this.filteredChoices = this.choices.filter(
        choice => choice[1].toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1,
      )
    } else {
      this.filteredChoices = this.choices
    }
  }

  handleChange = val => {
    this.inputValue = val
    this.props.onChange && this.props.onChange(val)
  }

  handleFocusInput = () => {
    this.active = true
  }
  handleUnFocusInput = () => {
    this.active = false
  }
  chooseValue = val => {
    this.props.onSelect && this.props.onSelect(val)
    this.props.blankAfterSelect ? (this.inputValue = ``) : (this.inputValue = val[1])
  }

  renderSuggestions() {
    if (!this.active || this.inputValue === ``) return null
    return (
      <div className="suggestions" style={{ position: `relative`, zIndex: 10000 }}>
        {this.filteredChoices.map(choice => (
          <span
            key={choice}
            className="suggestions__item"
            onMouseDown={() => this.chooseValue(choice)}
            style={{ color: `black` }}
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
    const { className, noOptionsFunction } = this.props
    if (!this.loaded) {
      return <BasicInput placeholder="Loading..." disabled />
    }
    return (
      <div
        className={className}
        onKeyPress={e => {
          if (e.which === 13 || e.keyCode === 13) {
            if (this.filteredChoices.length === 0 && noOptionsFunction) {
              noOptionsFunction()
            } else {
              if(this.props.onChooseValue) this.props.onChooseValue()
              else this.chooseValue(this.filteredChoices[0])
            }
          }
        }}
      >
        <BasicInput
          placeholder={this.props.placeholder || `Type for suggestions...`}
          value={this.inputValue || ``}
          onChange={this.handleChange}
          onFocus={this.handleFocusInput}
          onBlur={this.handleUnFocusInput}
        />
        {this.filteredChoices.length > 0 && this.renderSuggestions()}
      </div>
    )
  }
}
