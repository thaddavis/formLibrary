import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
// import logger from 'exm-logger';
// import { SelectOption, TextInput, TextMaskPhoneInput, Helpers } from 'ocean-components';

// import userActions from 'actions/user-actions';

// import { getSelectedUser } from 'selectors/user-selector';

// import { getRelationshipByValue } from 'helpers/user-helper';
// import buildRoutes from 'helpers/route-helper';

// import i18n from 'utils/i18n/i18n';

import { relationshipOptions } from '../../../../data/dropdown-data';

// import CSS from './edit-emergency-contact.sass';

import { TextInput, SelectOption, TextMaskPhoneInput } from '../../../../ocean-components/ocean-components-v2/index';

import XevoForm from '../../../xevo-form';
import emergencyContactsSchema from '../../../../schemas/emergency-contacts-schema.json';

const p = console.log

class EditEmergencyContactInfo extends React.Component {
  constructor() {
    super();

    this.saveButtonClicked = this.saveButtonClicked.bind(this);
    this.cancelButtonClicked = this.cancelButtonClicked.bind(this);
    // this.setRelationship = this.setRelationship.bind(this);
  }

  async componentDidMount() {
    const { emergencyContacts } = this.props;
    if (emergencyContacts && emergencyContacts.length) {
      this.setEmergencyContacts(emergencyContacts);
    } else if (this.props.appIsReady) {
      try {
        // const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
        // this.setEmergencyContacts(res);
      } catch (error) {
        // logger.error('Something went wrong in edit-emergency-contact');
        // logger.error(error);
      }
    }

    // this.props.disableSave(!this.isFormValid());
  }

  async componentDidUpdate(prevProps) {
    if (this.props.appIsReady && prevProps.appIsReady !== this.props.appIsReady) {
      // const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
      // this.setEmergencyContacts(res);
    }
    if (this.props.saveClickEvent && this.props.saveClickEvent !== prevProps.saveClickEvent) {
      return this.props.save(this.saveButtonClicked);
    }
    if (this.props.cancelClickEvent && this.props.cancelClickEvent !== prevProps.cancelClickEvent) {
      return this.props.cancel(false);
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.form && nextProps.form.valid) {
      if (this.props.disableSave) this.props.disableSave(false); 
    } else {
      if (this.props.disableSave) this.props.disableSave(true);
    }

    return true;
  }

  // setEmergencyContacts(emergencyContacts) {
  //   const {
  //     id,
  //     name,
  //     dayPhone,
  //     relationship: relationshipValue,
  //     address,
  //   } = this.prePopulateFields(emergencyContacts);
  //   // const currentRelationship = getRelationshipByValue(relationshipValue);
  //   const relationshipDisplay = '';

  //   this.setState({
  //     id,
  //     name,
  //     dayPhone,
  //     relationship: {
  //       value: relationshipValue,
  //       display: relationshipDisplay,
  //     },
  //     address: { ...this.state.address, ...address },
  //   }, this.enableSaveButton);
  // }

  // setRelationship(e, inputName, value) {
  //   this.setState({
  //     relationship: {
  //       value: value.value,
  //       display: value.display,
  //     },
  //   });
  // }

  async saveButtonClicked() {
    try {
      // debugger;
      alert('Submitted: ' + JSON.stringify(this.props.form.values));
      // await this.props.userActions.saveEmergencyContact(data);
      // this.props.history.push(buildRoutes('profile_information'));
    } catch (error) {
      // logger.error('Error happen when saving residency-info, Error:');
      // logger.error(error);
    }
  }

  cancelButtonClicked() {
    // this.props.history.push(buildRoutes('profile_information'));
  }

  // handleInput(e, inputName, value) {
  //   if (inputName === 'email') {
  //     this.setState({
  //       address: {
  //         ...this.state.address,
  //         [inputName]: value,
  //       },
  //     }, this.enableSaveButton);
  //   } else {
  //     this.setState({ [inputName]: value }, this.enableSaveButton);
  //   }
  // }

  // handleBlur(e, inputName, value) {
  //   if (inputName === 'dayPhone') {
  //     this.setState({ [inputName]: value }, this.enableSaveButton);
  //   }
  //   this.isFormValid();
  // }

  // enableSaveButton() {
  //   this.props.disableSave(!this.isFormValid());
  // }

  // isFormValid() {
  //   const name = get(this.state, 'name', '');
  //   const dayPhone = get(this.state, 'dayPhone', '');
  //   const relationship = get(this.state, 'relationship.value', '');
  //   const address = get(this.state, 'address.email', '');

  //   return !isEmpty(name) &&
  //     !isEmpty(dayPhone) &&
  //     !isEmpty(relationship) &&
  //     !isEmpty(address) 
  //     // &&
  //     // Helpers.isEmailValid(address) &&
  //     // Helpers.isPhoneNumberValid(dayPhone);
  // }

  // showWarningIfFieldIsEmpty(field, message) {
  //   return isEmpty(field) ? message : '';
  // }

  // prePopulateFields(emergencyContacts = []) {
  //   const emergencyContact = isEmpty(emergencyContacts) ? {} : emergencyContacts[0];

  //   return {
  //     id: get(emergencyContact, 'id', ''),
  //     name: get(emergencyContact, 'name', ''),
  //     dayPhone: get(emergencyContact, 'dayPhone', ''),
  //     relationship: get(emergencyContact, 'relationship', ''),
  //     address: {
  //       email: get(emergencyContact, 'address.email', ''),
  //     },
  //   };
  // }

  renderFormTitle(title, required = true) {
    return (
      <div className={CSS.formTitle}>
        <h1 className={CSS.title}>{title}</h1>
        {required ? <span className={CSS.required}>{'required'}</span> : null}
      </div>
    );
  }

  render() {
    // const { name, dayPhone, address, relationship } = this.state;

    return (
      <XevoForm
        formId="emergencyContactsJuiceForm"
        schema={emergencyContactsSchema}
      >
        <div className={CSS.container}>
          {this.renderFormTitle('emergency_contact', false)}

          <div>
            <TextInput formKey="0.name"></TextInput>
          </div>
          <div>
            <TextMaskPhoneInput formKey="0.dayPhone"></TextMaskPhoneInput>
          </div>
          <div>
            <TextInput formKey="0.email"></TextInput>
          </div>
          <div>
            <SelectOption formKey="0.relationship"
              options={relationshipOptions()}
            ></SelectOption>
          </div>

          {/* <TextInput
            value={this.state.name}
            onInputChange={this.handleInput}
            inputName="name"
            id="emergency_contact_name_input"
            label={i18n.t('name')}
            showWarning={this.showWarningIfFieldIsEmpty(name, i18n.t('emergency_contact_incomplete_name'))}
          />
          <TextMaskPhoneInput
            value={this.state.dayPhone}
            maskValue={this.state.dayPhone}
            onInputChange={this.handleInput}
            onBlur={this.handleBlur}
            inputName="dayPhone"
            id="emergency_contact_dayPhone_input"
            label={i18n.t('phone_number')}
            showWarning={this.showWarningIfFieldIsEmpty(dayPhone, i18n.t('emergency_contact_incomplete_number'))}
          />
          <TextInput
            value={this.state.address.email}
            onInputChange={this.handleInput}
            inputName="email"
            type="email"
            id="emergency_contact_email_input"
            label={i18n.t('email')}
            showWarning={this.showWarningIfFieldIsEmpty(get(address, 'email'), i18n.t('emergency_contact_address_name'))}
          />
          <SelectOption
            inputName="relationship"
            id="emergency_contact_relationship_input"
            label={i18n.t('relationship')}
            value={this.state.relationship.display}
            onClick={this.setRelationship}
            options={relationshipOptions()}
            showWarning={this.showWarningIfFieldIsEmpty(get(relationship, 'value'), i18n.t('emergency_contact_relationship_name'))}
          /> */}
        </div>
      </XevoForm>
    );
  }
}

EditEmergencyContactInfo.defaultProps = {
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

EditEmergencyContactInfo.propTypes = {
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
  return {};
  // return {
  //   userActions: bindActionCreators(userActions, dispatch),
  // };
}

function mapStateToProps(state) {
  // const selectedUser = getSelectedUser(state);

  return {
    // appIsReady: state.session.appIsReady,
    // userId: state.session.selectedUserId,
    appIsReady: true,
    userId: '1',
    // emergencyContacts: selectedUser.emergencyContacts,
    // form: state.form.emergencyContactsJuiceForm
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditEmergencyContactInfo);
