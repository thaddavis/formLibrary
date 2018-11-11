import React from 'react';

import get from 'lodash/get';
import classnames from 'classnames';
import set from 'lodash/set';

import CSS from './TextInput.module.sass';

// Helpers
// import { isEmailValid } from 'helpers/signup-helper';

// Components
// import PasswordValidation from '../password-validation/password-validation';

const p = console.log;

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      value: ''
    };

    this.inputRef = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.touched && get(nextProps.touched, nextProps.path) && nextProps.data) {
      return {
        value: get(nextProps.data, nextProps.path) || ''
      }
    }

    return {}
  }

  handleChange(event) {
    const inputValue = event.currentTarget.value;
    this.setState({value: event.target.value});
    p(this.props.onChange(event, this.props.path, inputValue));
  }

  handleBlur(event) {
    this.setState({ focused: false });
    const inputValue = event.currentTarget.value;
    // this.setState({value: event.target.value});
    p(this.props.onBlur(event, this.props.path, inputValue));
  }

  handleFocus(event) {
    p('handleFocus')
    this.inputRef.focus();
    this.setState({ focused: true });  
  }

  render() {

    p('render --- ')
    p(this.state)
    
    const labelClass = classnames(
      CSS.labelText
    );

    const containerClass = classnames(
      { [CSS.textInputContainer]: this.state.focused || this.state.value },
      { [CSS.textInputContainerIsFocusedOrHasValues]: !this.state.focused && !this.state.value }
    );

    const inputClass = classnames(
      CSS.textInput,
      { [CSS.error]: get(this.props.errors, this.props.path) }
    );
    
    return (
      <div 
        className={containerClass}
      >
        <input value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          className={inputClass}
          ref={(ref) => this.inputRef = ref}
        />
        <span className={CSS.bar}></span>
        <label className={labelClass}
          onFocus={this.handleFocus}
          onClick={this.handleFocus}
        >
          {this.props.path}
        </label>
        <div>
          {this.error()}
        </div>
      </div>
    );
    
  }

  error() {
    let errors = get(this.props.errors, this.props.path);
    
    if (errors) {
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

export default TextInput;
