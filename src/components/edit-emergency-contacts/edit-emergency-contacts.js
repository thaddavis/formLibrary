import React from 'react';

import { connect } from 'react-redux';
import XevoForm from '../xevo-form';
import EditEmergencyContactInfo from '../edit-emergency-contact/edit-emergency-contact.js';
import emergencyContactsSchema from '../../schemas/emergency-contacts-schema.json';
import { prepareValues } from '../../helpers/helpersForAjv';

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
    await this.props.formActions.setFields({
      formId: this.props.formId,
      values: data
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
    alert('An essay was submitted: ' + JSON.stringify(this.props.form.values));
    event.preventDefault();
  }

  render() {
    return (
      <div>
        Edit Emergency Contacts Form
        <form onSubmit={this.handleSubmit}>
          <div>
            {
              this.renderUiSchema(uiSchema, {
                onBlur: this.handleOnBlur,
                onChange: this.handleOnChange,
                path: '',
                data: prepareValues(this.props.form.values, uiSchema.type === 'array' ? '0' : ''),
                // data: this.props.data,
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
  p('mapStateToProps');
  p(state);

  return {
    data: [{
      // id: '1',
      // name: 'one'
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
      validateForm: dispatch.form.validateForm,
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEmergencyContactsForm);

