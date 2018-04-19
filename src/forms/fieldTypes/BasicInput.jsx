import React from "react"
import PropTypes from "prop-types"

export default class BasicInput extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    initialValue: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    onRawChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    value: ``,
  }

  handleChangeValueType(e){
    const { onChange } = this.props
    if(this.props.type === 'checkbox'){
      onChange(e.target.checked)
    } else {
      onChange(e.target.value)
    }

  }

  handleChange = e => {
    const { onChange } = this.props
    if (onChange) this.handleChangeValueType(e)
  }

  render() {
    const { onChange, disabled, value, ...otherProps } = this.props
    return (
      <input
        className="input"
        {...otherProps}
        value={value || ``}
        name={this.props.name}
        disabled={disabled || false}
        onChange={this.handleChange}
      />
    )
  }
}
