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
    const { value } = this.props
    if (!value) return null
    if (!value.url) return ``
    if(value.record.persisted) {
      if(value.record.requestedAttributes.includes('image__small')){
        return <img src={value.record.image__small} alt="img" />
      } else {
        console.warn('Add image__small to requested form fields to show preview')
      }
    } else {
      return <img src={value.url} alt="img" />
    }
  }

  render() {
    const { name, value, multiple, onFocus } = this.props
    if (!value.allowedTypes) throw new Error(`YOU MUST SET DEFAULT TYPES IN THE MODEL!!!!!!!!`)
    return (
      <React.Fragment>
        <label style={{ cursor: `pointer` }}>
          <div className={`image-field${!value || !value.url ? ` unselected` : ``}`}>
            <div>{this.renderPreview()}</div>
          </div>
          <input
            type="file"
            name={name}
            multiple={multiple}
            accept={value.allowedTypes.map(x => `.${x}`).join(`,`)}
            onChange={this.handleChange}
            onFocus={onFocus}
          />
        </label>
      </React.Fragment>
    )
  }
}
