import React from 'react'
import get from 'lodash/get';

const p = console.log

class XevoForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.displayedErrors = this.displayedErrors.bind(this);
    this.renderUiSchema = this.renderUiSchema.bind(this);
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
  }

  async handleOnChange(e, inputName, value) {
    await this.props.changeField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: this.props.form.values,
    });
  }

  displayedErrors(key) {
    if (get(this.props.form.touched, key)) {
      return get(this.props.form.errors, key);
    }
    return false;
  }

  renderUiSchema(uiSchema) {
    
    if (
      uiSchema.type === 'array' || uiSchema.type === 'object'
    ) {
      return 'renderUiSchema --- array or object'
    }

    return 'renderUiSchema';
  }

  render() {
    return 'EditEmergencyContactsInfo'
  }

}

export default XevoForm