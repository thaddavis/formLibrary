import React from 'react';
import { connect } from 'react-redux';

import XevoForm from '../../xevo-form';

import { withRouter } from 'react-router-dom';

import { TextInput, Checkbox } from '../../../ocean-components/better-components/index';
import FormHeader from '../sharedFormComponents/form-header/form-header.js';
import FormFooter from '../sharedFormComponents/form-footer/form-footer.js';

import Contact from '../../../schemas/contact.json';
import { prepareValues } from '../../../helpers/helpersForAjv';

import CSS from '../sharedFormStyles/formBody.module.sass';

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
    console.log('handleSubmit');
    alert('Submitted: ' + JSON.stringify(this.props.form.values));

    this.props.formActions.resetForm({formId: this.props.formId});
    this.props.history.goBack();

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <FormHeader
          title="Create Person"
        ></FormHeader>
        <div className={CSS.formContainer}>
          <form className={CSS.form} onSubmit={this.handleSubmit}>
            {
              this.renderUiSchema(uiSchema, {
                onBlur: this.handleOnBlur,
                onChange: this.handleOnChange,
                path: '',
                data: prepareValues(this.props.form.values, uiSchema.type === 'array' ? '0' : ''),
                // data: prepareValues(this.props.data, uiSchema.type === 'array' ? '0' : ''),
                errors: this.props.form.errors,
                touched: this.props.form.touched,
              })
            }
            <FormFooter
              loading={false}
              onCancel={(evt) => {
                console.log('onCancel');
                evt.preventDefault();
                this.props.history.goBack();
              }}
              onSave={(evt) => {
                console.log('onSave');
                this.handleSubmit(evt);
              }}
              cancelBtnLabel="Cancel"
              saveBtnLabel="Save"
              cancelButtonDisable={false}
              saveButtonDisable={!this.props.form.valid}
              containerStyles=""
            ></FormFooter>  
          </form>
        </div>
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
      resetForm: dispatch.form.reset,
      removeKey: dispatch.form.removeKey,
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePersonForm));

