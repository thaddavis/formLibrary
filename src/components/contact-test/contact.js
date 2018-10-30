import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { TextInput } from '../ocean-components';
import Ajv from 'ajv';

import XevoForm from './xevo-form';

import CSS from './edit-emergency-contact.sass';

const p = console.log;

const uiSchema = {
  type: 'object',
  items: {
    row1: {
      type: 'array',
      ordered: true,
      items: {
        firstName: {
          type: 'field',
          component: TextInput,
        },
        middle: {
          type: 'field',
          component: TextInput,
        },
      },
    },
    row2: {
      type: 'array',
      ordered: true,
      items: {
        lastName: {
          type: 'field',
          component: TextInput,
        },
      },
    },
  },
};

class ContactForm extends XevoForm {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <br />

        Contact Form

        {
          this.renderUiSchema(uiSchema, {
            onBlur: this.handleOnBlur,
            onChange: this.handleOnChange,
            path: this.props.path,
            data: this.props.data,
            errors: this.props.errors,
            touched: this.props.touched,
          })
        }

      </div>
    );
  }
}

ContactForm.defaultProps = {
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

ContactForm.propTypes = {
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
    // formActions: {
    //   blurField: dispatch.form.blurField,
    //   changeField: dispatch.form.changeField,
    //   setFields: dispatch.form.setFields,
    //   validateForm: dispatch.form.validateForm,
    // }
  };
}

function mapStateToProps(state) {
  // const selectedUser = getSelectedUser(state);

  return {
    appIsReady: true,
    userId: '1',
    form: state.form.editEmergencyContact,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactForm);
