import React from "react"
import PropTypes from "prop-types"
import { observer, inject } from "mobx-react"
import { titleize } from "help-my-strings"
import BasicInput from "./fieldTypes/BasicInput"
import Textarea from "./fieldTypes/textarea"
import ImageField from "./fieldTypes/image"
import FileField from "./fieldTypes/file"
import Checkbox from "./fieldTypes/checkbox"
import Select from "./fieldTypes/Select"
import CollectionSelect from "./fieldTypes/CollectionSelect"
import CollectionTagSelector from "./fieldTypes/CollectionTagSelector"
import CollectionCheckBoxes from "./fieldTypes/CollectionCheckBoxes"

@inject(`form`)
@observer
export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    field: PropTypes.string,
    form: PropTypes.object,
    onChange: PropTypes.func,
    render: PropTypes.func,
    title: PropTypes.string,
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
    const { fullEditor, characterCount, placeholder, disabled } = this.props
    switch (type) {
    case `text-area`:
      return <Textarea value={value} onChange={handleChange} />
    case `image`:
      return <ImageField value={value} onChange={handleChange} />
    case `file`:
      return <FileField value={value} onChange={handleChange} />
    case `checkbox`:
      return (
        <Checkbox
          value={value}
          onChange={handleChange}
          fieldTitle={fieldTitle}
          defaultValue={this.props.defaultValue}
        />
      )
    case `select`:
      return (
        <Select
          value={value}
          onChange={handleChange}
          choices={this.props.choices}
          defaultValue={this.props.defaultValue}
          includeBlank={this.props.includeBlank}
        />
      )
    case `collection_select`:
      return (
        <CollectionSelect
          value={value}
          onChange={handleChange}
          collection={this.props.collection}
          name_attribute={this.props.name_attribute}
          value_attribute={this.props.value_attribute}
          choices={this.props.choices}
          defaultValue={this.props.defaultValue}
          includeBlank={this.props.includeBlank}
        />
      )
    case `collection-tag-select`:
      return (
        <CollectionTagSelector
          collection={this.props.collection}
          name_attribute={this.props.name_attribute}
          value_attribute={this.props.value_attribute}
          onChange={handleChange}
          createFunction={this.props.createFunction}
          value={value}
        />
      )
    case `number`:
      return (
        <BasicInput
          type={type}
          value={value}
          step={this.props.step}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
      )
    default:
      return (
        <BasicInput
          type={type}
          value={value}
          // disabled={disabled}
          placeholder={placeholder}
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
    const fieldTitle = titleize(title ? title : field)

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
