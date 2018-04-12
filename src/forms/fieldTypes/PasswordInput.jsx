import React from 'react'
import PropTypes from 'prop-types'
import { styled, t } from "lib/utils/theme"
import { observer } from "mobx-react"
import { observable, reaction, action, computed } from "mobx"
import Wrapper from "lib/components/wrapper"
import List from 'lib/components/list'
@styled`
  position: relative;
  text-align: right;
  .field {
    margin-bottom: 10px;
  }
  .password_helpers {
    display: inline-block;
    font-size: 0.9em;
    text-align: left;
    font-weight: 600;
    ul{
      padding: 0;
      margin: 0;
      list-style: none;   
    }   
    .error {
      color: ${t(`lightText`)}
    }
    .complete {
      color: ${t(`primary`)}
    }
  }
`
@observer
export default class PasswordInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    initialValue: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  }

  @observable confirmationPassword
  @observable passwordValue
  
  @observable errors = []

  componentDidMount(){
    this.matchPassword(``, ``)
  }

  handlePasswordChange = (e) => {
    this.passwordValue = e.target.value
    this.matchPassword(this.passwordValue, this.confirmationPassword)
  }
  handlePassConfirmationChange = (e) => {
    this.confirmationPassword = e.target.value
    this.matchPassword(this.passwordValue, this.confirmationPassword)
  }

  matchPassword(password, password2){
    let errors = []
    Object.entries(this.helpers).map(([key, value]) => {
      errors.push({ [key]: value(password) })
    })
    if(password.length > 1) errors.push({ "Password and Confirmation password must match.": password === password2 })
    this.errors.replace(errors)
    this.validate()
  }

  validate = () => {
    let isValid = true
    this.errors.map(error=>{
      if (!Object.values(error)[0]) isValid = false
    })
    this.props.valid(isValid)
    this.props.password(this.passwordValue)
  }

  helpers = {
    "At least 8 characters long": value => value.length >= 8,
    "Contains a lowercase letter": value => /[a-z]/.test(value),
    "Contains an uppercase letter": value => /[A-Z]/.test(value),
    "Contains a number": value => /[0-9]/.test(value),
  }

  @computed
  get renderHelpers() {
    return (
      <Wrapper className="password_helpers" background={`#f5f5f5`}>
        <List spacing={2}>
          {this.errors.map(error=>(
            Object.entries(error).map(([error, active])=>(
              <List.Item style={{ display: `block`, flex: `1` }} className={`${active ? `complete` : `error`}`}>{error} {active ? `complete` : `error`}</List.Item>
            ))
          ))}
        </List>
      </Wrapper>
    )
  }

  render() {
    return (
      <div>
        <input
          className="input"
          type="password"
          name="password"
          value={this.passwordValue}
          placeholder={this.props.placeholder || `Password`}
          onChange={this.handlePasswordChange}
        />
        <div>
          <input
            className="input"
            type="password"
            name="password_confirmation"
            value={this.confirmationPassword}
            placeholder="Password Confirmation"
            onChange={this.handlePassConfirmationChange}
          />
        </div>
        {this.renderHelpers}
      </div>
    )
  }
}
