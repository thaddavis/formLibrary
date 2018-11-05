import React from 'react';

import { connect } from 'react-redux';

import XevoForm from '../xevo-form';

import TextInput from '../../ocean-components/better-components/TextInput'
import Essay from '../../schemas/essay.json';
import { prepareValues } from '../../helpers/helpersForAjv';

const p = console.log;

const uiSchema = {
  type: 'object',
  items: {
    author: {
      type: 'field',
      component: TextInput,
    },
    content: {
      type: 'field',
      component: TextInput,
    }
  },
};

class CreatePersonForm extends XevoForm {
  constructor(props) {
    super(props);
    
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange(e, inputName, value) {
    this.props.formActions.changeField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: Object.assign({}, this.props.form && this.props.form.values),
    });
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + JSON.stringify(this.props.form.values));

    event.preventDefault();
  }

  render() {
    return (
      <div>
        Create Person Form
      </div>
    )
  }
}

function mapStateToProps(state) {
  p('mapStateToProps');
  p(state);

  return {
    data: {
        id: '1',
        name: 'one'
    },
    formId: 'createPerson',
    schema: Essay, 
    form: state.form.createPerson,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: {
      blurField: dispatch.form.blurField,
      changeField: dispatch.form.changeField,
      setFields: dispatch.form.setFields,
      validateForm: dispatch.form.validateForm,
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePersonForm);

