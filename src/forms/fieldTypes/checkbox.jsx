import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'lib/utils/theme'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'

@styled`
  .label {
    position: relative;
    display: flex;
    margin: .6em 0;
    align-items: center;
    outline: none;
    cursor: pointer;
  }
  
  input[type='checkbox']{ display: none; }
  
  input[type='checkbox'] + .check-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 4px;
    width: 16px;
    height: 16px;
    background: transparent;
    border: 2px solid #bfbfbf;
    border-radius: 2px;
    cursor: pointer;  
    transition: all 250ms cubic-bezier(.4,.0,.23,1);
  }
  
  input[type='checkbox']:checked + .check-box {
    border: 8px solid #333;
    animation: shrink-bounce 200ms cubic-bezier(.4,.0,.23,1);
    &:before{
      content: "";
      position: absolute;
      top: 6px;
      left: 3px;
      border-right: 3px solid transparent;
      border-bottom: 3px solid transparent;
      transform: rotate(45deg);
      transform-origin: 0% 100%;
      animation: checkbox-check 125ms 250ms cubic-bezier(.4,.0,.23,1) forwards;
    }
  }
  
  @keyframes shrink-bounce{
    0%{
      transform: scale(1);
    }
    33%{    
      transform: scale(.85);
    }
    100%{
      transform: scale(1);    
    }
  }
  @keyframes checkbox-check{
    0%{
      width: 0;
      height: 0;
      border-color: #efefef;
      transform: translate3d(0,0,0) rotate(45deg);
    }
    33%{
      width: .2em;
      height: 0;
      transform: translate3d(0,0,0) rotate(45deg);
    }
    100%{    
      width: .2em;
      height: .5em;    
      border-color: #efefef;
      transform: translate3d(0,-.5em,0) rotate(45deg);
    }
  }
`
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
