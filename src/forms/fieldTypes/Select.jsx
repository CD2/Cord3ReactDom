import React from "react"
import PropTypes from "prop-types"

export default class SelectField extends React.Component {
  static propTypes = {
    choices: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
    includeBlank: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.PropTypes.any,
  }

  static defaultProps = {
    choices: [],
    disable: false,
    value: ``,
  }

  componentDidMount() {
    if (
      !this.props.includeBlank &&
      !this.props.value &&
      this.props.choices &&
      this.props.onChange &&
      this.choices.length > 0
    ) {
      this.props.onChange(this.choices[0][0])
    }
  }

  get choices() {
    return this.props.choices.map(choice => {
      let text
      let value
      if (typeof choice === `string` || typeof choice === `number`) {
        text = choice
        value = choice
      } else if (Array.isArray(choice)) {
        text = choice[1]
        value = choice[0]
      } else {
        text = choice.text
        value = choice.value
      }
      return [value, text]
    })
  }

  handleChange = e => {
    const { onRawChange, onChange } = this.props
    if (onChange) onChange(e.target.value)
  }

  renderChoices() {
    const { includeBlank } = this.props
    const choiceHtml = []
    if (includeBlank) {
      const text = typeof includeBlank === `string` ? includeBlank : `-- Please select --`
      choiceHtml.push(
        <option key="$BLANK$" value="">
          {text}
        </option>,
      )
    }
    this.choices.forEach(([value, text]) => {
      if (this.props.defaultValue === value) {
        choiceHtml.push(
          <option key={value} value={value} selected>
            {text}
          </option>,
        )
      } else {
        choiceHtml.push(
          <option key={value} value={value}>
            {text}
          </option>,
        )
      }
    })
    return choiceHtml
  }

  render() {
    const { name, value, disabled, className } = this.props
    return (
      <div className="select">
        <select
          name={name}
          value={value || ``}
          disabled={disabled}
          onChange={this.handleChange}
          className="select-input"
        >
          {this.renderChoices()}
        </select>
      </div>
    )
  }
}
