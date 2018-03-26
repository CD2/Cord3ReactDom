import React from "react"
import PropTypes from "prop-types"
import { observer, inject } from "mobx-react"
import { titleize } from "help-my-strings"
import BasicInput from "./fieldTypes/BasicInput"
import Textarea from "./fieldTypes/textarea"
import ImageField from "./fieldTypes/image"
import FileField from "./fieldTypes/file"
import Checkbox from "./fieldTypes/checkbox"
import DateInput from "./fieldTypes/DateInput"
import Select from "./fieldTypes/Select"
import CollectionSelect from "./fieldTypes/CollectionSelect"
import CollectionTagSelector from "./fieldTypes/CollectionTagSelector"
import CollectionCheckBoxes from "./fieldTypes/CollectionCheckBoxes"

@inject(`form`)
@observer
export default class Input extends React.Component {
  static propTypes = {
    characterCount: PropTypes.number,
    choices: PropTypes.array,
    className: PropTypes.string,
    collection: PropTypes.object,
    createFunction: PropTypes.func,
    customLabel: PropTypes.string,
    custom_attribute: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    description: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.string,
    form: PropTypes.object,
    fullEditor: PropTypes.any,
    includeBlank: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name_attribute: PropTypes.string,
    noLabel: PropTypes.bool,
    onChange: PropTypes.func,
    placeholder: PropTypes.any,
    render: PropTypes.func,
    sortAlphabetically: PropTypes.bool,
    step: PropTypes.any,
    title: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
    value_attribute: PropTypes.string,
  }

  constructor(props) {
    super(props)
    if (props.field.type === `checkbox`) {
      if (props.defaultValue) {
        this.record[this.field] = props.defaultValue
      }
    }
  }

  get record() {
    return this.props.form.record
  }

  get field() {
    return this.props.field
  }

  handleChange = val => {
    if (this.props.onChange) this.props.onChange()
    this.record[this.field] = val
  }

  renderInput(type, value, handleChange, fieldTitle) {
    const { placeholder } = this.props
    switch (type) {
    case `text-area`:
      return <Textarea value={value} name={this.props.field} onChange={handleChange} />
    case `image`:
      return <ImageField value={value} name={this.props.field} onChange={handleChange} />
    case `file`:
      return <FileField value={value} name={this.props.field} onChange={handleChange} />
    case `checkbox`:
      return (
        <Checkbox
          value={value}
          fieldTitle={fieldTitle}
          defaultValue={this.props.defaultValue}
          name={this.props.field}
          onChange={handleChange}
        />
      )
    case `select`:
      return (
        <Select
          value={value}
          choices={this.props.choices}
          defaultValue={this.props.defaultValue}
          includeBlank={this.props.includeBlank}
          name={this.props.field}
          onChange={handleChange}
        />
      )
    case `collection_select`:
      return (
        <CollectionSelect
          value={value}
          collection={this.props.collection}
          name_attribute={this.props.name_attribute}
          value_attribute={this.props.value_attribute}
          choices={this.props.choices}
          defaultValue={this.props.defaultValue}
          includeBlank={this.props.includeBlank}
          sortAlphabetically={this.props.sortAlphabetically}
          name={this.props.field}
          onChange={handleChange}
        />
      )
    case `collection-tag-select`:
      return (
        <CollectionTagSelector
          collection={this.props.collection}
          name_attribute={this.props.name_attribute}
          value_attribute={this.props.value_attribute}
          createFunction={this.props.createFunction}
          value={value}
          name={this.props.field}
          onChange={handleChange}
        />
      )
    case `number`:
      return (
        <BasicInput
          type={type}
          value={value}
          step={this.props.step}
          placeholder={placeholder}
          name={this.props.field}
          onChange={this.handleChange}
        />
      )
    case `date`:
      return (
        <DateInput
          value={value}
          placeholder={placeholder}
          name={this.props.field}
          onChange={this.handleChange}
        />
      )
    case `collection-checkboxes`:
      return (
        <CollectionCheckBoxes
          collection={this.props.collection}
          name_attribute={this.props.name_attribute}
          value_attribute={this.props.value_attribute}
          custom_attribute={this.props.custom_attribute}
          createFunction={this.props.createFunction}
          customLabel={this.props.customLabel}
          value={value}
          onChange={handleChange}
        />
      )
    default:
      return (
        <BasicInput
          type={type || `text`}
          value={value}
          placeholder={placeholder}
          name={this.props.field}
          onChange={this.handleChange}
        />
      )
    }
  }

  render() {
    const { field, render, type, title, description, noLabel } = this.props
    const value = this.props.value || this.record[field]
    const errors = this.record.errors.messagesFor(field)
    const onChange = this.handleChange
    const fieldTitle = title ? title : titleize(field)

    if (render) return render(value, errors, this.handleChange)

    let renderedErrors = null
    if (errors) {
      renderedErrors = (
        <div className="error-message">{errors.map((err, i) => <p key={i}>{err}</p>)}</div>
      )
    }
    if (type === `hidden`) {
      return this.renderInput(type, value, onChange, fieldTitle)
    }
    return (
      <div className={`cord-field ${this.props.className}${errors.length > 0 ? ` errors` : ``}`}>
        <label className="cord-label">
          {type !== `collection-checkboxes` && type !== `checkbox` && !noLabel && fieldTitle}
        </label>
        {this.renderInput(type, value, onChange, fieldTitle)}
        {description && <span className="description">{description}</span>}
        {renderedErrors}
      </div>
    )
  }
}
