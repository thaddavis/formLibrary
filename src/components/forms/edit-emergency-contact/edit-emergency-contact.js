import React from 'react';

import { connect } from 'react-redux';
import JuiceForm from '../../juice-form';
import { TextInput } from '../../../ocean-components/better-components'
import emergencyContactsSchema from '../../../schemas/emergency-contact-schema.json';
import { prepareValues } from '../../../helpers/helpersForAjv';

const p = console.log;

const uiSchema = {
  type: 'object',
  items: {
    name: {
      type: 'field',
      component: TextInput,
    },
    dayPhone: {
      type: 'field',
      component: TextInput,
    },
    email: {
      type: 'field',
      component: TextInput,
    },
    relationship: {
      type: 'field',
      component: TextInput,
    },
  },
};

class EditEmergencyContactForm extends JuiceForm {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
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
    )
  }
}

export default EditEmergencyContactForm;

