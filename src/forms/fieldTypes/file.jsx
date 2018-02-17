import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

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
    return <b>{ value.basename }</b>
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
