import React from "react"
import PropTypes from "prop-types"

export class TextArea extends React.Component {
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
    const { name, value, placeholder, initialValue, onFocus, onKeyPress } = this.props

    return (
      <textarea
        name={name}
        defaultValue={initialValue}
        className="textarea input"
        value={value || ``}
        placeholder={placeholder}
        onChange={this.handleChange}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        rows={5}
      />
    )
  }
}
export default TextArea
