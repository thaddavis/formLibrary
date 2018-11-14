/*
  Xevo Application Library
  Copyright © 2017 Xevo Inc.
  Patents Pending
  All rights reserved.
  This file contains confidential and proprietary information of Xevo Inc.
  Unauthorized reproduction or distribution of this document is strictly prohibited.
  Xevo Inc.
  Website: www.xevo.com
  Email: info@xevo.com
*/

import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

// Helpers
import { isPhoneNumberValid } from '../helpers/string-helper';

// Styles
import CSS from './text-mask-phone-input.module.sass';

class TextMaskPhoneInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      error: '',
    };
    this.inputRef = {};
    this.focusField = this.focusField.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    if (this.props.error) {
      this.setState({ error: this.props.error });
    }
    if (this.props.value && this.props.value !== this.state.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({ error: nextProps.error });
    }

    if (nextProps.value && nextProps.value !== this.state.value) {
      this.setState({
        value: this.transformValueToMaskValue(nextProps.value),
      });
    }
  }

  focusField() {
    this.inputRef.focus();
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleInputChange(e, value = '') {
    const inputValue = value || e.currentTarget.value;

    const onlyNumbers = new RegExp(/^[0-9]*$/);
    if (onlyNumbers.test(inputValue.replace(/-/g, ''))) {
      this.setState({ value: this.transformValueToMaskValue(inputValue) });
      return this.props.onChange(e, this.props.inputName, this.transformValueToMaskValue(inputValue));
    }
  }

  transformValueToMaskValue(val) {
    const newVal = val.replace(/-/g, '');

    if (newVal) {
      if (newVal && (newVal.length === 7 || newVal.length === 10)) {
        const result = newVal.length === 7 ? `${newVal.slice(0, 3)}-${newVal.slice(3)}` :
          `${newVal.slice(0, 3)}-${newVal.slice(3, 6)}-${newVal.slice(6)}`;

        return result;
      }

      return newVal.replace('-', '');
    }

    return val;
  }

  label() {
    if (!this.props.label) return;

    return (
      <label
        className={CSS.labelContainer}
        htmlFor={`${this.state.id}-input`}
        aria-label={this.props.label + (this.props.subText ? ` ${this.props.subText}` : '')}
        role="textbox"
      >
        {this.props.label}
      </label>
    );
  }

  error() {
    if ((!this.state.error && !this.props.showWarning) || this.state.focused) return <div />;

    const className = classnames({ [CSS.errorMessage]: this.state.error }, { [CSS.warnMessage]: this.props.showWarning });
    if (this.props.showWarning) {
      return (
        <div className={className}>
          {this.props.showWarning}
        </div>
      );
    }
    return (
      <div className={className}>
        {this.state.error}
      </div>
    );
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }

    this.setState({
      value: this.state.value,
      error: '',
    });

    this.inputRef.focus();
    this.setState({ focused: true });
  }

  async onBlur(e) {
    this.setState({ focused: false });

    await this.validateField();
    if (!this.state.error) {
      this.setState({
        value: this.state.value,
      });
    }

    if (this.props.onBlur) {
      // this.props.onBlur(e, this.props.inputName, this.state.value);
    }
  }

  validateField() {
    if (this.state.value && this.state.value.length < 5) {
      this.setState({ error: 'Your number is too short' });
    } else if (this.state.value && this.state.value.length > 15) {
      this.setState({ error: 'Your number is too long' });
    } else if (this.state.value && !isPhoneNumberValid(this.state.value)) {
      this.setState({ error: 'Your number is not valid' });
    }
  }

  render() {
    const containerClassName = classnames(
      CSS.textInputContainer,
      { [CSS.noHeight]: (!!this.state.value.length && this.props.validatePasswordInput) },
      { [this.props.containerClassName]: !!this.props.containerClassName },
    );
    const classname = classnames(
      CSS.textInput,
      { [CSS.error]: this.state.error || this.props.showError },
      { [CSS.warning]: this.props.showWarning },
    );

    const labelClass = classnames(
      CSS.labelText,
      { [CSS.elevateText]: !!this.state.value.length && this.props.disabled },
    );

    return (
      <div className={containerClassName}>

        <input
          id={`text_input_${this.props.id}`}
          className={classname}
          onChange={this.handleInputChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onClick={this.onFocus}
          value={this.state.value}
          aria-label={this.props.label}
          type="text"
          ref={(ref) => this.inputRef = ref}
          required="required"
          disabled={this.props.disabled}
          autoComplete={this.props.autocomplete}
        />

        <span className={CSS.bar} />
        <label
          onFocus={this.onFocus}
          className={labelClass}
          onClick={this.focusField}
          id={`text_input_label_${this.props.id}`}
        >
          {this.props.label}
        </label>
        {this.error()}
      </div>
    );
  }
}

TextMaskPhoneInput.defaultProps = {
  error: '',
  id: '',
  label: '',
  className: '',
  type: 'text',
  isValid: false,
  validatePasswordInput: false,
  inputName: '',
  showError: false,
  value: '',
  containerClassName: '',
  showWarning: '',
  disabled: false,
  onKeyDown: Function.prototype,
  autocomplete: '',
};

TextMaskPhoneInput.propTypes = {
  containerClassName: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  onInputChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  inputName: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  isValid: PropTypes.bool,
  validatePasswordInput: PropTypes.bool,
  showError: PropTypes.bool,
  showWarning: PropTypes.string,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.string,
};

export default TextMaskPhoneInput;