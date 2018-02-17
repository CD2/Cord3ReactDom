import React from "react"
import PropTypes from "prop-types"
import { observable, action } from "mobx"
import { observer } from "mobx-react"
import Image from "lib/components/image"
import image_add from "lib/images/image-add-button.svg"

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
  }

  handleChange = e => {
    const { onChange } = this.props
    if (onChange) onChange(e.target.files[0])
  }

  renderPreview() {
    const { value, model } = this.props
    if (!value) return null
    if (!value.url) return <Image defaultSrc={image_add} />
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
