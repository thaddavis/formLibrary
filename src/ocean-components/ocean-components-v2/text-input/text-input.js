import React from 'react';

import get from 'lodash/get';
import classnames from 'classnames';

import CSS from './text-input.module.sass';

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

  handleChange(event) {
    const inputValue = event.currentTarget.value;
    this.setState({value: event.target.value});
    this.props.onChange(event, this.props.formKey, inputValue);
  }

  handleBlur(event) {
    this.setState({ focused: false });
    const inputValue = event.currentTarget.value;
    this.props.onBlur(event, this.props.formKey, inputValue);
  }

  handleFocus(event) {
    this.inputRef.focus();
    this.setState({ focused: true });  
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

  render() {

    const labelClass = classnames(
      CSS.labelText
    );

    const containerClass = classnames(
      { [CSS.textInputContainer]: this.state.focused || this.state.value },
      { [CSS.textInputContainerIsNotFocusedOrDoesNotHaveValues]: !this.state.focused && !this.state.value }
    );

    const inputClass = classnames(
      CSS.textInput,
      { [CSS.error]: get(this.props.errors, this.props.formKey) }
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
          aria-label={this.props.label}
          id={`text_input_${this.props.id}`}
        />
        <span className={CSS.bar}></span>
        <label className={labelClass}
          htmlFor={`text_input_${this.props.id}`}
          onFocus={this.handleFocus}
          onClick={this.handleFocus}
        >
          {this.props.label}
        </label>
        <div>
          {this.error()}
        </div>
      </div>
    );
    
  }
}

export default TextInput;
