import React from 'react'
import PropTypes from 'prop-types'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import Image from "lib/components/image"
import image_add from "lib/images/image-add-button.svg"
import FaIcon from "../../../lib/components/fa_icon"
import Button from "../../../lib/components/button"
import { styled } from "../../../lib/utils/theme"

@styled`
  .preview {
    margin-bottom: 10px;
  }
`
@observer
export default class FileField extends React.Component {

  static propTypes = {
    accepts: PropTypes.array,
    model: PropTypes.object,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onRawChange: PropTypes.func,
    onlySpreadsheets: PropTypes.bool,
    value: PropTypes.object,
  }

  static defaultProps = {
    accepts: [],
    onlySpreadsheets: false,
  }

  handleChange = (e) => {
    const { onChange } = this.props
    if (onChange) onChange(e.target.files[0])
  }

  renderPreview() {
    const { value, model } = this.props
    if(!value || !value.url) return null
    return <Button buttonStyle="minor"><FaIcon icon={value.extension} /> { value.basename }</Button>
  }

  render() {
    const { name, value, multiple, onFocus, onlySpreadsheets, className } = this.props
    let acceptedTypes = null

    return (
      <div className={className}>
        <div className='preview'>
          {/*{this.renderPreview()}*/}
        </div>

        <input
          type="file"
          name={name}
          multiple={multiple}
          accept={value.allowedTypes.map(x => `.${x}`).join(',')}
          onChange={this.handleChange}
          onFocus={onFocus}
        />
      </div>
    )
  }

}
