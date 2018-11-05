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
    
    // p('TextInput2 --- props constructor');
    // p(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  // shouldComponentUpdate(nextProps) {
  //   return true;
  // }

  handleChange(event) {
    const inputValue = event.currentTarget.value;
    this.setState({value: event.target.value});
    p(this.props.onChange(event, this.props.path, inputValue));
  }

  render() {

    // p('render --- ')
    // p(this.props)
  
    return (
      <div>
        <div>
          {this.props.path}
        </div>
        <input value={this.state.value} onChange={this.handleChange} />
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
