import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"

@observer
export default class FileField extends React.Component {
  static propTypes = {
    accepts: PropTypes.array,
    model: PropTypes.object,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    noAccept: PropTypes.bool,
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

  handleChange = e => {
    const { onChange } = this.props
    if (onChange) onChange(e.target.files[0])
  }

  render() {
    const { name, value, multiple, onFocus, noAccept } = this.props
    if (!value.allowedTypes) throw new Error(`YOU MUST SET DEFAULT TYPES IN THE MODEL!!!!!!!!`)
    return (
      <div className="file" style={{ marginTop: `4px` }}>
        {value.rawUid && (
          <React.Fragment>
            <div
              style={{
                padding: `10px`,
                border: `1px solid #ddd`,
                borderRadius: 5,
                marginBottom: 6,
                display: `inline-block`,
                background: `white`
              }}
            >
              {value.filename}
            </div>
            <br />
          </React.Fragment>
        )}
        <input
          type="file"
          name={name}
          multiple={multiple}
          accept={noAccept ? [] : value.allowedTypes.map(x => `.${x}`).join(`,`)}
          onChange={this.handleChange}
          onFocus={onFocus}
        />
      </div>
    )
  }
}
