import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"

@observer
export default class ImageField extends React.Component {
  static propTypes = {
    accepts: PropTypes.array,
    model: PropTypes.object,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onRawChange: PropTypes.func,
    onlyImages: PropTypes.bool,
    onlySpreadsheets: PropTypes.bool,
    value: PropTypes.object,
  }

  static defaultProps = {
    accepts: [],
    onlyImages: false,
    onlySpreadsheets: false,
    value: {},
  }

  handleChange = e => {
    const { onChange } = this.props
    if (onChange) onChange(e.target.files[0])
  }

  renderPreview() {
    const { value, model } = this.props
    if (!value) return null
    if (!value.url) return 'ADD!'
    return <img src={value.url} />
  }

  render() {
    const {
      name,
      value,
      multiple,
      onFocus,
      onlyImages,
      onlySpreadsheets,
    } = this.props
    let acceptedTypes = null
    if(!value.allowedTypes) throw new Error('YOU MUST SET DEFAULT TYPES IN THE MODEL!!!!!!!!')
    return (
      <div className="image-field">
        <div>{this.renderPreview()}</div>
        <div className="hidden">
          <input
            type="file"
            name={name}
            multiple={multiple}
            accept={value.allowedTypes.map(x => `.${x}`).join(`,`)}
            onChange={this.handleChange}
            onFocus={onFocus}
          />
        </div>
      </div>
    )
  }
}
