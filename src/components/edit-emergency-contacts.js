import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// import logger from 'exm-logger';
// import { SelectOption, TextInput } from 'ocean-components';
import { SelectOption, TextInput } from '../ocean-components';

import XevoForm from './xevo-form';

import formView from './form-view/form-view';
import emergencyContactsSchema from '../schemas/emergency-contacts-schema.json';
import EditEmergencyContactInfo from './edit-emergency-contact';
import CSS from './edit-emergency-contacts.sass';
import { prepareValues } from '../helpers/helpersForAjv';

const p = console.log;

const uiSchema = {
  type: 'array',
  items: {
    type: EditEmergencyContactInfo,
  },
};

class EditEmergencyContactsInfo extends XevoForm {
  constructor(props) {
    p('EditEmergencyContactsInfo --- constructor');

    super(props);

    p(this.props);

    // this.handleOnBlur = this.handleOnBlur.bind(this);
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.renderUiSchema = this.renderUiSchema.bind(this);
    this.saveButtonClicked = this.saveButtonClicked.bind(this);
    this.cancelButtonClicked = this.cancelButtonClicked.bind(this);
    this.enableSaveButton = this.enableSaveButton.bind(this);
    this.displayedErrors = this.displayedErrors.bind(this);
  }

  async componentDidMount() {
    p('componentDidMount');
    const { data } = this.props;
    if (data) {
      p('THERE');
      this.setFormFields(data);
    } else if (this.props.appIsReady) {
      p('HERE');
      try {
        const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
        this.setFormFields(res);
      } catch (error) {
        // logger.error('Something went wrong in edit-emergency-contact');
        // logger.error(error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    p('componentDidUpdate');

    if (this.props.appIsReady && prevProps.appIsReady !== this.props.appIsReady) {
      const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
      this.setEmergencyContacts(res);
    }
    if (this.props.saveClickEvent && this.props.saveClickEvent !== prevProps.saveClickEvent) {
      return this.props.save(this.saveButtonClicked);
    }
    if (this.props.cancelClickEvent && this.props.cancelClickEvent !== prevProps.cancelClickEvent) {
      return this.props.cancel(this.cancelButtonClicked);
    }
    return null;
  }

  async setFormFields(data) {
    await this.props.formActions.setFields({
      formId: this.props.formId,
      values: data
    });

    this.props.disableSave((this.props.form && !this.props.form.valid) || true);
  }

  async saveButtonClicked() {
    const data = {};

    try {
      await this.props.userActions.saveEmergencyContact(data);
      this.props.history.push('/');
    } catch (error) {
      // logger.error('Error happen when saving residency-info, Error:');
      // logger.error(error);
    }
  }

  cancelButtonClicked() {
    this.props.history.push('/');
  }

  async handleOnBlur(e, inputName, value) {
    p('handleOnBlur');

    await this.props.formActions.blurField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: this.props.form && this.props.form.values,
    });

    this.enableSaveButton();
  }

  async handleOnChange(e, inputName, value) {
    p('handleOnChange --- ***')
    // p(JSON.stringify(e))

    await this.props.formActions.changeField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: Object.assign({}, this.props.form && this.props.form.values),
    });

    this.enableSaveButton();
  }

  enableSaveButton() {
    this.props.disableSave((this.props.form && !this.props.form.valid) || true);
  }

  displayedErrors(key) {
    if (this.props.form.touched && this.props.form.touched[key]) {
      return this.props.form.errors && this.props.form.errors[key];
    }
    return null;
  }

  renderFormTitle(title, required = true) {
    return (
      <div className={CSS.formTitle}>
        <h1 className={CSS.title}>{title}</h1>
        {/* {required ? <span className={CSS.required}>*</span> : null} */}
      </div>
    );
  }

  // renderUiSchema(uiSchema) {
  //   // p('renderUiSchema');
  //   // p(uiSchema);

  //   return <uiSchema.items.type />;
  // }

  render() {
    // const { name, dayPhone } = this.state;

    p('render Baby!');
    // p(this.props.form);

    return (
      <div className={CSS.container}>
        {this.renderFormTitle('Emergency Contacts')}

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

        {/* <TextInput
          value={this.props.form.values && this.props.form.values.name}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          inputName="0.name"
          id="emergency_contact_name_input"
          label={i18n.t('name')}
          error={this.displayedErrors('name')}
          showError={this.props.form.touched && this.props.form.touched.name}
        />
        <TextInput
          value={this.props.form.values && this.props.form.values.phone}
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
          inputName="0.phone"
          id="emergency_contact_phone_input"
          label={i18n.t('phone_number')}
          error={this.displayedErrors('phone') || false}
          showError={this.props.form.touched && this.props.form.touched.phone}
        /> */}
        {/* <TextInput
          value={this.state.address.email}
          onInputChange={this.handleInput}
          inputName="email"
          type="email"
          id="emergency_contact_email_input"
          label={i18n.t('email')}
        />
        <SelectOption
          inputName="relationship"
          id="emergency_contact_relationship_input"
          label={i18n.t('relationship')}
          value={this.state.relationship.display}
          onClick={this.setRelationship}
          options={relationshipOptions()}
        /> */}
      </div>
    );
  }
}

EditEmergencyContactsInfo.defaultProps = {
  history: {
    push: Function.prototype,
  },
  userActions: {
    fetchUserEmergencyContact: Function.prototype,
    saveEmergencyContact: Function.prototype,
  },
  disableSave: Function.prototype,
  saveClickEvent: false,
  cancelClickEvent: false,
  save: Function.prototype,
  cancel: Function.prototype,
  appIsReady: false,
  userId: '',
};

EditEmergencyContactsInfo.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  userActions: PropTypes.shape({
    saveEmergencyContact: PropTypes.func,
    fetchUserEmergencyContact: PropTypes.func,
  }),
  disableSave: PropTypes.func,
  saveClickEvent: PropTypes.bool,
  cancelClickEvent: PropTypes.bool,
  save: PropTypes.func,
  cancel: PropTypes.func,
  appIsReady: PropTypes.bool,
  userId: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    //userActions: bindActionCreators(userActions, dispatch),
    formActions: {
      blurField: dispatch.form.blurField,
      changeField: dispatch.form.changeField,
      setFields: dispatch.form.setFields,
      validateForm: dispatch.form.validateForm,
    }
  };
}

function mapStateToProps(state) {
  // const selectedUser = getSelectedUser(state);

  return {
    //   appIsReady: state.session.appIsReady,
    //   userId: state.session.selectedUserId,
    //   emergencyContacts: selectedUser.emergencyContacts,
    appIsReady: true,
    userId: '123',
    data: [
      {
        id: '1',
        name: 'one'
      }
    ],
    form: state.form.editEmergencyContacts,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(formView({
  backPath: 'profile_information',
  backText: 'personal_information',
  titleOverride: '',
  title: 'edit_emergency_info',
  WrappedComponent: EditEmergencyContactsInfo,
  schema: emergencyContactsSchema,
  formId: 'editEmergencyContacts',
}));