import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// import logger from 'exm-logger';
// import { SelectOption, TextInput } from 'ocean-components';
import { SelectOption, TextInput } from '../ocean-components';

// import userActions from 'actions/user-actions';
import user from '../models/user';

import formView from './form-view/form-view';

// import { getSelectedUser } from 'selectors/user-selector';

import { getRelationshipByValue } from '../helpers/user-helper';
// import buildRoutes from 'helpers/route-helper';

// import i18n from 'utils/i18n/i18n';

import { relationshipOptions } from '../data/dropdown-data';

import emergencyContactsSchema from '../schemas/emergency-contacts-schema.json';

import CSS from './edit-emergency-contact.sass';

let p = console.log

class EditEmergencyContactsInfo extends React.Component {
  constructor(props) {
    p('EditEmergencyContactsInfo --- constructor');

    super(props);

    p(this.props);

    this.state = {
      id: '',
      name: '',
      dayPhone: '',
      relationship: {
        value: '',
        display: '',
      },
      address: {
        email: '',
      },
    };

    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.saveButtonClicked = this.saveButtonClicked.bind(this);
    this.cancelButtonClicked = this.cancelButtonClicked.bind(this);
    this.setRelationship = this.setRelationship.bind(this);
    this.enableSaveButton = this.enableSaveButton.bind(this);
    this.displayedError = this.displayedError.bind(this);
  }

  async componentDidMount() {
    const { emergencyContacts } = this.props;
    if (emergencyContacts.length) {
      p('THERE');
      this.setFormFields(emergencyContacts);
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
    p('setFormFields');
    p(data);

    data = isEmpty(data) ? {} : data[0];

    const formValues = {
      id: get(data, 'id', ''),
      name: get(data, 'name', ''),
      dayPhone: get(data, 'dayPhone', ''),
      relationship: get(data, 'relationship', ''),
      address: {
        email: get(data, 'address.email', ''),
      },
    };

    // const {
    //   id,
    //   name,
    //   dayPhone,
    //   relationship: relationshipValue,
    //   address,
    // } = this.prePopulateFields(emergencyContacts);

    // const currentRelationship = getRelationshipByValue(relationshipValue);
    // const relationshipDisplay = currentRelationship.display || '';

    this.props.disableSave(!this.props.form.valid);
  }

  setRelationship(e, inputName, value) {
    this.setState({
      relationship: {
        value: value.value,
        display: value.display,
      },
    });
  }

  async saveButtonClicked() {
    const data = {
      id: this.state.id,
      name: this.state.name,
      dayPhone: this.state.dayPhone,
      relationship: this.state.relationship.value,
      address: this.state.address,
    };

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
    await this.props.blurField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: this.props.form.values,
    });

    this.enableSaveButton();
  }

  async handleOnChange(e, inputName, value) {
    await this.props.changeField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: this.props.form.values,
    });

    this.enableSaveButton();
  }

  enableSaveButton() {
    this.props.disableSave(!this.props.form.valid);
  }

  displayedError(key) {
    if (this.props.form.touched && this.props.form.touched[key]) {
      return this.props.form.errors && this.props.form.errors[key];
    }
    return null;
  }

  renderFormTitle(title, required = true) {
    return (
      <div className={CSS.formTitle}>
        <h1 className={CSS.title}>{title}</h1>
        {required ? <span className={CSS.required}>required</span> : null}
      </div>
    );
  }

  render() {
    const { name, dayPhone } = this.state;

    p('render Baby!');
    // p(this.props.form);
    // p(get(this.props.form.values, '0.name'));

    return (
      <div className={CSS.container}>
        {this.renderFormTitle('emergency_contact', false)}

        <TextInput
          value={get(this.props.form.values, '0.name')}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          inputName="0.name"
          id="emergency_contact_name_input"
          label='name'
          error={this.displayedError('name')}
          showError={this.props.form.touched && this.props.form.touched.name}
        />
        {/* <TextInput
          value={this.props.form.values && this.props.form.values[0] && this.props.form.values[0].phone}
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
          inputName="phone"
          id="emergency_contact_phone_input"
          label='phone_number'
          error={this.displayedError('phone') || false}
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
    blurField: dispatch.form.blurField,
    changeField: dispatch.form.changeField,
  };
}

function mapStateToProps(state) {
  // const selectedUser = getSelectedUser(state);

  return {
  //   appIsReady: state.session.appIsReady,
  //   userId: state.session.selectedUserId,
  //   emergencyContacts: selectedUser.emergencyContacts,
    appIsReady: true,
    userId: 1,
    emergencyContacts: [
      { name: 'TAD' }
    ],
    form: state.form.editEmergencyContacts,
    // form: [{
    //   name: 'TAD'
    // }]
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(formView({
  backPath: 'profile_information',
  backText: 'personal_information',
  title: 'edit_emergency_info',
  WrappedComponent: EditEmergencyContactsInfo,
  schema: emergencyContactsSchema,
  formId: 'editEmergencyContacts',
}));