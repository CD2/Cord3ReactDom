import React from "react"
import PropTypes from "prop-types"
import { observable, toJS } from "mobx"
import { observer } from "mobx-react"
import Select from "./Select"

@observer
export default class CollectionSelectField extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    model: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
  }

  handleChange = e => {
    const { onRawChange, onChange } = this.props
    if (onChange) onChange(e.target.value)
  }

  constructor(props) {
    super(props)
    this.getChoices()
  }

  @observable choices

  async getChoices() {
    const { name_attribute, value_attribute, collection } = this.props
    if (!collection) throw new Error(`You have not sent a collection - check your field!`)
    this.choices = await collection.pluck(value_attribute, name_attribute)
  }

  render() {
    const { onChange, value, defaultValue, name } = this.props
    if (!this.choices) return `LOADING!`
    return (
      <Select
        choices={toJS(this.choices)}
        value={value}
        onChange={onChange}
        includeBlank={this.props.includeBlank}
        defaultValue={defaultValue}
        name={name}
      />
    )
  }
}
