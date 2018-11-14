import React from 'react';

import get from 'lodash/get';
import classnames from 'classnames';

import CSS from './Checkbox.module.sass';

const p = console.log;

class CheckboxInput extends React.Component {
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

    // if (nextProps.touched && get(nextProps.touched, nextProps.path) && nextProps.data) {
      return {
        value: get(nextProps.data, nextProps.path)
      }
    // }

    // return {}
    
  }

  handleChange(event) {
    const inputValue = event.target.checked === true ? true : false;
    this.setState({value: inputValue});
    this.props.onChange(event, this.props.path, inputValue);
  }

  handleBlur(event) {
    this.setState({ focused: false });
    const inputValue = event.target.checked === true ? true : false;
    this.props.onBlur(event, this.props.path, inputValue);
  }

  handleFocus(event) {
    this.inputRef.focus();
    this.setState({ focused: true });  
  }

  render() {

    const labelClass = classnames(
      CSS.labelText
    );

    const containerClass = classnames(
      { [CSS.checkboxInputContainer]: this.state.focused || this.state.value },
      { [CSS.checkboxInputContainerIsNotFocusedOrDoesNotHaveValues]: !this.state.focused && !this.state.value }
    );

    const inputClass = classnames(
      CSS.checkboxInput,
      { [CSS.error]: get(this.props.errors, this.props.path) }
    );
  
    return (
      <div
        className={containerClass}
      >
        <input 
          type="checkbox"
          checked={!!this.state.value}
          onBlur={this.handleBlur} 
          onChange={this.handleChange} 
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

export default CheckboxInput;
