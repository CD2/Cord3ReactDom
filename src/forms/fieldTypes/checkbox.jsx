import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable } from "mobx"

@observer
export class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string, 
    customLabel: PropTypes.string,   
    defaultValue: PropTypes.oneOfType([PropTypes.bool]),
    fieldTitle: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onRawChange: PropTypes.func,
    value: PropTypes.any,
  }

  @observable checked = this.props.value

  handleChange = e => {
    const { onRawChange, onChange } = this.props
    if (onRawChange) onRawChange(e)
    if (onChange) {
      onChange(e.target.checked)
      this.checked = e.target.checked
    }
  }

  render() {
    const { fieldTitle, customLabel } = this.props
    return (
      <label style={{ marginTop: `8px` }}>
        <input
          className="checkbox"
          checked={this.checked || this.props.defaultValue}
          type="checkbox"
          name={this.props.name}
          onChange={this.handleChange}
        />
        <div style={{ display: `inline-block`, width: `20px`, verticalAlign: `middle` }}><span className="check-box" /></div>
        <span style={{ display: `inline-block`, verticalAlign: `middle` }}>{customLabel || fieldTitle}</span>
      </label>
    )
  }
}
export default Checkbox
