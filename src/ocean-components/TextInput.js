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
import moment from 'moment';
// import InputMask from 'react-input-mask';
import get from 'lodash/get';
import classnames from 'classnames';
import set from 'lodash/set';

// Helpers
// import { isEmailValid } from 'helpers/signup-helper';

// Components
// import PasswordValidation from '../password-validation/password-validation';

// Styles
import CSS from './TextInput.sass';

const p = console.log;

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = {};
    this.focusField = this.focusField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    p('componentWillReceiveProps');
    p(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    p('shouldComponentUpdate');
    // debugger;
    p(this.inputRef)

    this.inputRef.selectionStart = 1;
    this.inputRef.selectionEnd = 1;
    // for (let k of Object.keys(nextProps)) {
    //   p(k);
    //   // debugger;
    //   if (nextProps[k] !== this.props[k]) {
    //     return true;
    //   }
    // }

    return true;
  }

  focusField() {
    this.inputRef.focus();
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  onChange(e, value = '') {
    const inputValue = value || e.currentTarget.value;

    // debugger;

    // this.props.model.name = evt.target.value;
    // this.props.value = inputValue;
    if (this.props.onChange) {
      this.props.onChange(e, this.props.path, inputValue);
    }
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.inputRef.focus();
  }

  onBlur(e, value = '') {
    const inputValue = value || e.currentTarget.value;
    if (this.props.onBlur) {
      this.props.onBlur(e, this.props.path, inputValue);
    }
  }

  render() {
    const containerClassName = classnames(
      CSS.textInputContainer,
      { [CSS.noHeight]: (this.props.value && !!this.props.value.length) },
      { [this.props.containerClassName]: !!this.props.containerClassName },
    );
    const classname = classnames(
      CSS.textInput,
      { [CSS.error]: this.props.errors },
      { [CSS.warning]: this.props.showWarning },
    );

    const labelClass = classnames(
      CSS.labelText,
      { [CSS.elevateText]: this.props.value && !!this.props.value.length && this.props.disabled },
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
          // value={get(this.props.data, this.props.path)}
          value={this.props.value}
          aria-label={this.props.label}
          type={(this.props.type === 'email' || this.props.type === 'tel') ? 'text' : this.props.type}
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

  label() {
    if (!this.props.label) return;

    return (
      <label
        className={CSS.labelContainer}
        htmlFor={`${this.props.id}-input`}
        aria-label={this.props.label + (this.props.subText ? ` ${this.props.subText}` : '')}
        role="textbox"
      >
        Label{this.props.label}
      </label>
    );
  }

  error() {
    // p('error()')
    // p(this.props)

    let errors = get(this.props.errors, this.props.path);
    let touched = get(this.props.touched, this.props.path);

    if (touched && errors) {
      return (
        errors.map((e, index) => (
          <div key={index} className={classnames(CSS.errorMessage)}>
            { e.code }
            <br />
          </div>
        ))
      );
    }

    return (
      <div />
    );
  }
}

TextInput.defaultProps = {
  errors: false,
  id: '',
  label: '',
  className: '',
  onChange: Function.prototype,
  onBlur: Function.prototype,
  type: 'text',
  isValid: false,
  inputName: '',
  value: '',
  data: {},
  path: '',
  containerClassName: '',
  showWarning: '',
  disabled: false,
  onKeyDown: Function.prototype,
  autocomplete: '',
};

TextInput.propTypes = {
  containerClassName: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  path: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  inputName: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  type: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  isValid: PropTypes.bool,
  showWarning: PropTypes.string,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.string,
};

export default TextInput;
