import React from "react"
import PropTypes from "prop-types"
import { styled, t } from "lib/utils/theme"
import { observer } from "mobx-react"
import { observable, reaction, action, computed } from "mobx"
import Wrapper from "lib/components/wrapper"
import List from "lib/components/list"

@styled`
  position: relative;
  .password_helpers {
    width: 100%;
    display: inline-block;
    font-size: 0.9em;
    text-align: left;
    font-weight: 600;
    .error {
      color: ${t(`delete`)}
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

  @observable confirmationPassword = ``
  @observable passwordValue = ``

  @observable errors = []

  componentDidMount() {
    this.matchPassword(``, ``)
  }

  @action
  handlePasswordChange = e => {
    this.passwordValue = e.target.value
    this.matchPassword()
  }

  @action
  handlePassConfirmationChange = e => {
    this.confirmationPassword = e.target.value
    this.matchPassword()
  }

  matchPassword() {
    const password = this.passwordValue
    const password2 = this.confirmationPassword
    let errors = []
    Object.entries(this.helpers).map(([key, value]) => {
      errors.push({ [key]: value(password) })
    })
    if ((!password || password.length < 8) && (password2 || password2.length < 8))
    {errors.push({ "Password and Confirmation password must match.": false })}
    else errors.push({ "Password and Confirmation password must match.": password === password2 })
    this.errors.replace(errors)
    this.props.errors && this.props.errors(this.errors)
    this.props.password && this.props.password(this.passwordValue)
    this.props.onChange && this.props.onChange(this.passwordValue)
    this.props.onChangeConfirmation && this.props.onChangeConfirmation(this.confirmationPassword)
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
      <Wrapper className="password_helpers" background={`#f5f5f5`} borderRadius={5}>
        <List spacing={2}>
          {this.errors.map(error =>
            Object.entries(error).map(([error, active]) => (
              <List.Item
                key={error}
                style={{ display: `block`, flex: `1` }}
                className={`${active ? `complete` : `error`}`}
              >
                {error}
              </List.Item>
            )),
          )}
        </List>
      </Wrapper>
    )
  }

  render() {
    return (
      <div className={this.props.className}>
        <div style={{ padding: `0 0 ${this.props.spacing || '10px'} 0` }}>
          <input
            className="input"
            type="password"
            name="password"
            value={this.passwordValue}
            placeholder={this.props.placeholder || `Password`}
            onChange={this.handlePasswordChange}
          />
        </div>
        <div style={{ padding: `0 0 ${this.props.spacing || '10px'} 0` }}>
          <input
            className="input"
            type="password"
            name="password_confirmation"
            value={this.confirmationPassword}
            placeholder="Password Confirmation"
            onChange={this.handlePassConfirmationChange}
          />
        </div>
        <div style={{ padding: `2px` }}>{this.renderHelpers}</div>
      </div>
    )
  }
}
