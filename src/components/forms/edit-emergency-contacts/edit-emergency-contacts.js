import React from 'react';

import { connect } from 'react-redux';
import XevoForm from '../../xevo-form';
import EditEmergencyContactInfo from '../edit-emergency-contact/edit-emergency-contact.js';
import emergencyContactsSchema from '../../../schemas/emergency-contacts-schema.json';
import { prepareValues } from '../../../helpers/helpersForAjv';

import FormHeader from '../sharedFormComponents/form-header/form-header.js';
import FormFooter from '../sharedFormComponents/form-footer/form-footer.js';

import { withRouter } from 'react-router-dom';

import CSS from '../sharedFormStyles/formBody.module.sass';

const p = console.log;

const uiSchema = {
  type: 'array',
  items: {
    type: EditEmergencyContactInfo,
  },
};

class EditEmergencyContactsForm extends XevoForm {
  constructor(props) {
    super(props);
    
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    p('componentDidMount');
    const { data } = this.props;
    if (this.props.form.values) {
      
    } else if (data) {
      this.setFormFields(data);
      p('HERE');
      try {
        // const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
        // this.setFormFields(res);
      } catch (error) {
        // logger.error('Something went wrong in edit-emergency-contact');
        // logger.error(error);
      }
    } else {

    }
  }

  async setFormFields(data) {
    await this.props.formActions.validateForm({
      formId: this.props.formId,
      values: data,
      schema: emergencyContactsSchema
    });

    // this.props.disableSave((this.props.form && !this.props.form.valid) || true);
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
    alert('Submitted: ' + JSON.stringify(this.props.form.values));
    this.props.formActions.resetForm({formId: this.props.formId});
    this.props.history.goBack();
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <FormHeader
          title="Edit Emergency Contacts Form"
        ></FormHeader>
        <div className={CSS.formContainer}>
          <form className={CSS.form}>
            {
              this.renderUiSchema(uiSchema, {
                onBlur: this.handleOnBlur,
                onChange: this.handleOnChange,
                path: '',
                data: prepareValues(this.props.form.values, uiSchema.type === 'array' ? '0' : ''),
                // data: prepareValues(this.props.form, uiSchema.type === 'array' ? '0' : ''),
                // data: this.props.data,
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
  p('mapStateToProps');
  p(state);

  return {
    data: [{
      id: '1',
      name: 'one'
    }],
    formId: 'editEmergencyContacts',
    schema: emergencyContactsSchema, 
    form: state.form.editEmergencyContacts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: {
      blurField: dispatch.form.blurField,
      changeField: dispatch.form.changeField,
      setFields: dispatch.form.setFields,
      resetForm: dispatch.form.reset,
      validateForm: dispatch.form.validateForm,
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditEmergencyContactsForm));

