import React from "react"
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import { observable, reaction, action, computed } from "mobx"

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
  @observable show = false

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
    if ((!password || password.length < 8) && (password2 || password2.length < 8)) {
      errors.push({ "Password and confirmation password must match": false })
    } else errors.push({ "Password and confirmation password must match": password === password2 })
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
      <div className="password-helpers">
        {this.errors.map(error =>
          Object.entries(error).map(([error, active]) => (
            <span className="password-helpers__item"
              key={error}
              style={{ display: `block`, flex: `1` }}
              className={`${active ? `complete` : `error`}`}
            >
              {error}
            </span>
          )),
        )}
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <input
          className="input"
          type={this.show ? `text` : `password`}
          name="password"
          value={this.passwordValue}
          placeholder={this.props.placeholder || `Password`}
          onChange={this.handlePasswordChange}
        />
        <div
          style={{
            background: '#ddd',
            fontSize: '0.85em',
            display: 'inline-block',
            padding: 6,
            borderRadius: 4,
            margin: '3px 0 0 0'
          }}
          onClick={()=>this.show = !this.show}>
          {this.show ? `Hide` : `Show`}
        </div>
        {
          !this.props.noConfirmation &&
          <div style={{ padding: `0 0 ${this.props.spacing || `10px`} 0` }}>
            <input
              className="input"
              type="password"
              name="password_confirmation"
              value={this.confirmationPassword}
              placeholder="Password Confirmation"
              onChange={this.handlePassConfirmationChange}
            />
          </div>
        }
        {/*<div style={{ padding: `2px` }}>{this.renderHelpers}</div>*/}
      </React.Fragment>
    )
  }
}
