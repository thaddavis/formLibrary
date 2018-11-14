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

import get from 'lodash/get';
import classnames from 'classnames';

import CSS from './text-mask-phone-input.module.sass';

class TextMaskPhoneInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
    this.inputRef = {};
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.focused === true) {
      return {}
    } else if (
      nextProps.touched && 
      get(nextProps.touched, nextProps.formKey) && 
      nextProps.data
    ) {
      return {
        value: get(nextProps.data, nextProps.formKey) || ''
      }
    }
    return {}
  }

  componentDidMount() {
    if (this.props.value && this.props.value !== this.state.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  label() {
    if (!this.props.label) return;
    return (
      <label
        className={CSS.labelContainer}
        htmlFor={`text_input_${this.props.id}`}
        aria-label={this.props.label + (this.props.subText ? ` ${this.props.subText}` : '')}
        role="textbox"
      >
        {this.props.label}
      </label>
    );
  }

  error() {
    let errors = get(this.props.errors, this.props.formKey);
    if (errors && errors[0]) {
      return (
        <div className={classnames(CSS.errorMessage)}>
          { errors[0].code }
          <br />
        </div>
      );
    }
    return (
      <div />
    );
  }

  onFocus(e) {
    this.inputRef.focus();
    this.setState({ focused: true });
  }

  onBlur(e) {
    this.setState({ focused: false });
    const inputValue = e.currentTarget.value;
    this.props.onBlur(e, this.props.formKey, inputValue);
  }

  onChange(e, value = '') {
    const inputValue = value || e.currentTarget.value;
    const onlyNumbers = new RegExp(/^[0-9]*$/);
    if (onlyNumbers.test(inputValue.replace(/-/g, ''))) {
      this.setState({ value: this.transformValueToMaskValue(inputValue) });
      this.props.onChange(e, this.props.formKey, this.transformValueToMaskValue(inputValue));
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

  render() {
    const containerClassName = classnames(
      { [CSS.textInputContainer]: this.state.focused || this.state.value },
      { [CSS.textInputContainerIsNotFocusedOrDoesNotHaveValues]: !this.state.focused && !this.state.value }
    );

    const containerClass = classnames(
      { [CSS.textInputContainer]: this.state.focused || this.state.value },
      { [CSS.textInputContainerIsNotFocusedOrDoesNotHaveValues]: !this.state.focused && !this.state.value }
    );

    const classname = classnames(
      CSS.textInput,
      { [CSS.error]: get(this.props.errors, this.props.formKey) },
    );

    const labelClass = classnames(
      CSS.labelText
    );

    return (
      <div className={containerClassName}>

        <input
          id={`text_input_${this.props.id}`}
          className={classname}
          onChange={this.onChange}
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
          onClick={this.onFocus}
          className={labelClass}
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
  onChange: PropTypes.func,
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