import React from "react"
import PropTypes from "prop-types"
import decorate from "lib/utils/decorate"

export class BasicInput extends React.Component {
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
    const { onChange, className, ...otherProps } = this.props
    return (
      <input
        className='input'
        {...otherProps}
        onChange={this.handleChange}
      />
    )
  }
}
export default decorate(
  BasicInput,
)
