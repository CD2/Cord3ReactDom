import React from "react"
import PropTypes from "prop-types"

export default class DateInput extends React.Component {
  static propTypes = {
    initialValue: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    onRawChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: ``,
  }

  handleChange = e => {
    const { onChange } = this.props
    if (onChange) onChange(e.target.value)
  }

  render() {
    const { value } = this.props
    return (
      <input
        type="date"
        className="input"
        maxlength="8"
        value={value ? value.split(`T`)[0] : value || ``}
        name={this.props.name}
        onChange={this.handleChange}
      />
    )
  }
}
