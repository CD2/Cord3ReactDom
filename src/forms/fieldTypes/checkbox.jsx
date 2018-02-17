import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

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

  handleChange = (e) => {
    const { onRawChange, onChange } = this.props
    if (onRawChange) onRawChange(e)
    if (onChange) {
      onChange( e.target.checked )
      this.checked = e.target.checked
    }
  }

  render() {
    const { className, fieldTitle } = this.props
    return (
      <div className={className}>
        <label className='label'>
          <input
            className="input"
            checked={this.checked || this.props.defaultValue}
            onChange={this.handleChange}
            type="checkbox"
          />
          <span className="check-box" />
          <span>{fieldTitle}</span>
        </label>
      </div>
    )
  }

}
export default Checkbox
