import React from 'react';

import { connect } from 'react-redux';

import XevoForm from '../xevo-form';

import { TextInput, Checkbox } from '../../ocean-components/better-components/index';

import Contact from '../../schemas/contact.json';
import { prepareValues } from '../../helpers/helpersForAjv';

import CSS from './create-person-component.sass';

const p = console.log;

const uiSchema = {
  type: 'object',
  items: {
    firstName: {
      type: 'field',
      component: TextInput,
    },
    middleName: {
      type: 'field',
      component: TextInput,
    },
    lastName: {
      type: 'field',
      component: TextInput,
    },
    isMinor: {
      type: 'field',
      component: Checkbox,
    },
    parentOrGuardianName: {
      dependsOn: [ 'isMinor' ],
      type: 'field',
      component: TextInput,
    },
    parentOrGuardianPhone: {
      dependsOn: [ 'isMinor' ],
      type: 'field',
      component: TextInput,
    }
  },
};

class CreatePersonForm extends XevoForm {
  constructor(props) {
    super(props);
    
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange(e, inputName, value) {
    p('handleOnChange');
    // debugger;

    this.props.formActions.changeField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: Object.assign({}, this.props.form && this.props.form.values),
    });
  }

  handleOnBlur(e, inputName, value) {
    this.props.formActions.blurField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: this.props.form && this.props.form.values,
    });
  }

  handleSubmit(event) {
    alert('Submitted: ' + JSON.stringify(this.props.form.values));

    event.preventDefault();
  }

  renderFormTitle(title) {
    return (
      <div className={CSS.formTitle}>
        <h1 className={CSS.title}>{title}</h1>
      </div>
    );
  }

  render() {
    p('render --- CreatePersonForm')

    return (
      <div className="container">
        { this.renderFormTitle(this.props.formId) }
        <form onSubmit={this.handleSubmit}>
          <div>
            {
              this.renderUiSchema(uiSchema, {
                onBlur: this.handleOnBlur,
                onChange: this.handleOnChange,
                path: '',
                data: prepareValues(this.props.form.values, uiSchema.type === 'array' ? '0' : ''),
                errors: this.props.form.errors,
                touched: this.props.form.touched,
              })
            }
          </div>
          <div>
            <button type="submit" disabled={!this.props.form.valid}>
              Submit
            </button>
            {/* <button type="button" disabled={pristine || submitting} onClick={reset}>
              Clear Values
            </button> */}
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: {
        id: '1',
        name: 'one'
    },
    formId: 'createPersonForm',
    schema: Contact, 
    form: state.form.createPersonForm,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: {
      blurField: dispatch.form.blurField,
      changeField: dispatch.form.changeField,
      setFields: dispatch.form.setFields,
      validateForm: dispatch.form.validateForm,
      removeKey: dispatch.form.removeKey,
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePersonForm);

