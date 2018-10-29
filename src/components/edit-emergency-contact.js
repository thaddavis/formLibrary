import React from 'react'
import XevoForm from './xevo-form';

import { SelectOption, TextInput } from '../ocean-components';

var uiSchema = {
  "name": TextInput,
  "dayPhone": TextInput,
  "email": TextInput,
  "relationship": TextInput
}
class EditEmergencyContactInfo extends XevoForm {

  constructor(props) {
    super(props);
  }

  render() {
    return this.renderUiSchema(uiSchema)
  }

}

export default EditEmergencyContactInfo;