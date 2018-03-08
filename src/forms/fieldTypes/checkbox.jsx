import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable } from "mobx"

@observer
export class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    fieldTitle: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onRawChange: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.bool]),
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
    const { className, fieldTitle, customLabel } = this.props
    return (
      <label style={{marginTop: '8px'}}>
        <input
          className="checkbox"
          checked={this.checked || this.props.defaultValue}
          onChange={this.handleChange}
          type="checkbox"
        />
        <span style={{display: 'inline-block'}}>
          {
            customLabel || fieldTitle
          }
        </span>
      </label>
    )
  }
}
export default Checkbox
