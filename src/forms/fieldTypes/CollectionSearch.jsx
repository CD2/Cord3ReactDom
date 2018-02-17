import React from "react"
import PropTypes from "prop-types"
import { observable } from "mobx"
import { observer } from "mobx-react"
import store from "utils/store"
import BasicInput from "./BasicInput"
import { Async } from "../../"
import Select from "./Select"

import Collection from "cord/model/Collection"
import decorate from "../../../lib/utils/decorate"
import { styled, t } from "lib/utils/theme"
import FaIcon from "../../../lib/components/fa_icon"

export class CollectionSelectField extends React.Component {
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
    if (!this.active || !this.inputValue || this.inputValue.length === 0) return null
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
        <FaIcon icon="search"/>
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

export default decorate(
  styled`
  position: relative;
  i {
    position: absolute;
    top: 9px;
    left: 9px;
    opacity: 0.4;
  }
  input {
    padding-left: 32px;
  }
  position: relative;
  .suggestions {
    background-color: white;
    border-radius: ${t(`borderRadii.panel`)};
    border: 1px solid ${t(`border`)};
    width: 100%;
    position: absolute;
    height: 200px;
    overflow: auto;
    z-index: 100;
    &__item {
      display: block;
      padding: 8px;
      cursor: pointer;
      font-size: 0.9em;
      font-weight: 600;
      &:hover {
        background: ${t(`background`)}
      }
    }
  }
  .selected-item {
    background: ${t(`background`)};
    font-size: 0.9em;
    padding: 4px 8px;
    font-weight: 600;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin: 0 5px 5px 0;
    i {
      margin-left: 6px;
    }
  }
`,
  observer,
  CollectionSelectField,
)
