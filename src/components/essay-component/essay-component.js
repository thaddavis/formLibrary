import React from 'react';

import { connect } from 'react-redux';

import XevoForm from '../xevo-form';

import TextInput from '../../ocean-components/better-components/TextInput'
import Essay from '../../schemas/essay.json';
import { prepareValues } from '../../helpers/helpersForAjv';

const p = console.log;

const uiSchema = {
  type: 'object',
  items: {
    author: {
      type: 'field',
      component: TextInput,
    },
    content: {
      type: 'field',
      component: TextInput,
    }
  },
};

class EssayForm extends XevoForm {
  constructor(props) {
    super(props);
    
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    p('render --- EssayForm')

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
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
    )
  }
}

function mapStateToProps(state) {
  p('mapStateToProps');
  p(state);

  return {
    data: {
        id: '1',
        name: 'one'
    },
    formId: 'createEssay',
    schema: Essay, 
    form: state.form.createEssay,
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

export default connect(mapStateToProps, mapDispatchToProps)(EssayForm);

