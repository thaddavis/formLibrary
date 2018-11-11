import React from 'react';

import get from 'lodash/get';
import classnames from 'classnames';
import set from 'lodash/set';

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

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.touched && get(nextProps.touched, nextProps.path) && nextProps.data) {
      return {
        value: get(nextProps.data, nextProps.path)
      }
    }

    return {}
  }

  handleChange(event) {
    p('checkbox --- handleChange');
    p(event.target.checked);
    // debugger;
    const inputValue = event.target.checked === true ? true : false;
    this.setState({value: inputValue});
    p(this.props.onChange(event, this.props.path, inputValue));
  }

  handleBlur(event) {
    const inputValue = event.target.checked === true ? true : false;
    // this.setState({value: event.target.value});
    p(this.props.onBlur(event, this.props.path, inputValue));
  }

  render() {

    // p('render --- ')
    // p(this.props)
    // debugger;
  
    return (
      <div>
        <label>
          {this.props.path}
        </label>
        <input value={this.state.value} type="checkbox" onChange={this.handleChange} onBlur={this.handleBlur} />
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
