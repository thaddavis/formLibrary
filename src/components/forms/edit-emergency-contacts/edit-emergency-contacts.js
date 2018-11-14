import React from 'react';

import { connect } from 'react-redux';
import JuiceForm from '../../juice-form';
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

class EditEmergencyContactsForm extends JuiceForm {
  constructor(props) {
    super(props);
    
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setFormFields(data);
    }
  }

  async setFormFields(data) {
    await this.props.formActions.validateForm({
      formId: this.props.formId,
      values: data,
      schema: emergencyContactsSchema
    });
  }

  handleSubmit(event) {
    alert('Submitted: ' + JSON.stringify(this.props.form.values));
    this.props.formActions.resetForm({
      formId: this.props.formId,
      values: this.props.form && this.props.form.values,
    });
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
      name: 'one',
      tennis: true,
      soccer: true
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
      validateForm: dispatch.form.validateForm
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditEmergencyContactsForm));

