import React from "react"
import PropTypes from "prop-types"
import { observable, action } from "mobx"
import { observer } from "mobx-react"
import Checkbox from "./checkbox"

@observer
export default class CollectionCheckBoxes extends React.Component {
  static propTypes = {
    collection: PropTypes.func,
    name_attribute: PropTypes.string,
    value_attribute: PropTypes.array,
  }

  async componentDidMount() {
    const { name_attribute, value_attribute, custom_attribute, collection } = this.props
    if (!collection) throw new Error(`You have not sent a collection - check your field!`)
    this.choices = await collection.pluck(value_attribute, name_attribute, custom_attribute)
  }

  @observable choices
  @observable values = []

  @action
  handleChange = value => {
    if (this.values.includes(value)) {
      let index = this.values.indexOf(value)
      this.values.splice(index, 1)
    } else {
      this.values.push(value)
    }
    this.props.onChange(this.values)
  }

  render() {
    if (!this.choices) return `LOADING...`
    return (
      <div>
        {this.choices.map(choice => (
          <Checkbox
            value={this.values.includes(choice[0])}
            fieldTitle={choice[1]}
            customLabel={this.props.customLabel(choice)}
            onChange={() => this.handleChange(choice[0])}
          />
        ))}
      </div>
    )
  }
}
