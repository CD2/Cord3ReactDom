import React from "react"
import PropTypes from "prop-types"

export default class BasicInput extends React.Component {
  static propTypes = {
    initialValue: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    onRawChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    value: ``,
  }

  handleChange = e => {
    const { onChange } = this.props
    if (onChange) onChange(e.target.value)
  }

  render() {
    const { onChange, value, ...otherProps } = this.props
    return (
      <input
        className="input"
        {...otherProps}
        value={value || ``}
        name={this.props.name}
        onChange={this.handleChange}
      />
    )
  }
}
