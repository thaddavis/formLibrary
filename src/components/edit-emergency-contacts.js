import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// import logger from 'exm-logger';
// import { SelectOption, TextInput } from 'ocean-components';
import { SelectOption, TextInput } from '../ocean-components';

import formView from './form-view/form-view';
import emergencyContactsSchema from '../schemas/emergency-contacts-schema.json';
import EditEmergencyContactInfo from './edit-emergency-contact';
import CSS from './edit-emergency-contacts.sass';

let p = console.log

var uiSchema = {
  type: 'array',
  items: {
    type: EditEmergencyContactInfo
  }
}

class EditEmergencyContactsInfo extends React.Component {
  constructor(props) {
    p('EditEmergencyContactsInfo --- constructor');

    super(props);

    p(props)

    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.saveButtonClicked = this.saveButtonClicked.bind(this);
    this.cancelButtonClicked = this.cancelButtonClicked.bind(this);
    this.enableSaveButton = this.enableSaveButton.bind(this);
    this.displayedErrors = this.displayedErrors.bind(this);
    this.renderUiSchema = this.renderUiSchema.bind(this);
  }

  // custom data initialization code may be specified here
  async componentDidMount() {
    const { data } = this.props;
    if (data) {
      p('THERE');
      
      await this.props.setFields({ formId: this.props.formId, values: data });
      await this.props.validateForm({ formId: this.props.formId, schema: this.props.schema, values: this.props.form.values });
      this.props.disableSave(!this.props.form.valid);
    } else if (this.props.appIsReady) {
      try {
        const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
        this.props.setFields({
          formId: this.props.formId,
          values: res,
        });
        this.props.validateForm({
         schema: this.props.schema,
         values: this.props.values
        })
        this.props.disableSave(!this.props.form.valid);
      } catch (error) {
        // logger.error('Something went wrong in edit-emergency-contact');
        // logger.error(error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.appIsReady && prevProps.appIsReady !== this.props.appIsReady) {
      const res = await this.props.userActions.fetchUserEmergencyContact(this.props.userId);
    }
    if (this.props.saveClickEvent && this.props.saveClickEvent !== prevProps.saveClickEvent) {
      return this.props.save(this.saveButtonClicked);
    }
    if (this.props.cancelClickEvent && this.props.cancelClickEvent !== prevProps.cancelClickEvent) {
      return this.props.cancel(this.cancelButtonClicked);
    }
    return null;
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
    await this.props.blurField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: this.props.form.values,
      touched: this.props.form.touched,
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

  displayedErrors(key) {
    if (get(this.props.form.touched, key)) {
      return get(this.props.form.errors, key);
    }
    return false;
  }

  renderFormTitle(title, required = true) {
    return (
      <div className={CSS.formTitle}>
        <h1 className={CSS.title}>{title}</h1>
        {required ? <span className={CSS.required}>required</span> : null}
      </div>
    );
  }
  
  renderUiSchema(uiSchema) {
    p('renderUiSchema');
    p(uiSchema);

    return <uiSchema.items.type />
  }

  render() {
    
    return (
      <div className={CSS.container}>
        { this.renderFormTitle('emergency_contact', false) }

        {
          this.renderUiSchema(uiSchema)
        }
        
        {/* <TextInput
          value={get(this.props.form.values, '0.name')}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          inputName="0.name"
          id="emergency_contact_name_input"
          label='name'
          errors={this.displayedErrors('0.name')}
        />
        <TextInput
          value={get(this.props.form.values, '0.dayPhone')}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          inputName="0.dayPhone"
          id="emergency_contact_name_input"
          label='phone'
          errors={this.displayedErrors('0.dayPhone')}
        />
        <TextInput
          value={get(this.props.form.values, '0.email')}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          inputName="0.email"
          id="emergency_contact_name_input"
          label='email'
          errors={this.displayedErrors('0.email')}
        />
        <TextInput
          value={get(this.props.form.values, '0.relationship')}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          inputName="0.relationship"
          id="emergency_contact_name_input"
          label='relationship'
          errors={this.displayedErrors('0.relationship')}
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
    setFields: dispatch.form.setFields,
    validateForm: dispatch.form.validateForm,
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
        id: 'id1',
        name: 'TA',
        dayPhone: 's',
        email: 'a',
        // relationship: 'd',
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