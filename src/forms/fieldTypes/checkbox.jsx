import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable } from "mobx"

@observer
export class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    customLabel: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.bool]),
    fieldTitle: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onRawChange: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.any,
  }

  static defaultProps = {
    style: {}
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
      <label style={{ marginTop: `8px`, display: `inline-block`, verticalAlign: `middle`, ...this.props.style }}>
        <input
          className="checkbox"
          checked={this.checked || this.props.defaultValue}
          type="checkbox"
          name={this.props.name}
          style={{
            display: `inline-block`, 
            verticalAlign: `middle`
          }}
          onChange={this.handleChange}
        />
        <div style={{ display: `inline-block`, width: `20px`, verticalAlign: `middle` }}>
          <span className="check-box" />
        </div>
        <span style={{ display: `inline-block`, verticalAlign: `middle` }}>
          {customLabel || fieldTitle}
        </span>
      </label>
    )
  }
}
export default Checkbox
