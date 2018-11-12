import React from 'react';

import { connect } from 'react-redux';

import FormHeader from '../sharedFormComponents/form-header/form-header.js';
import FormFooter from '../sharedFormComponents/form-footer/form-footer.js';

import XevoForm from '../../xevo-form';

import { TextInput } from '../../../ocean-components/better-components'
import Essay from '../../../schemas/essay.json';
import { prepareValues } from '../../../helpers/helpersForAjv';

import CSS from '../sharedFormStyles/formBody.module.sass';

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
    alert('Submitted: ' + JSON.stringify(this.props.form.values));

    event.preventDefault();
  }

  render() {

    p('render --- EssayForm')

    return (
      <div>
        <FormHeader
          title="Create an Essay"
        ></FormHeader>
        <div className={CSS.formContainer}>
          <form className={CSS.form} onSubmit={this.handleSubmit}>
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
            
            <FormFooter
              loading={false}
              onCancel={(evt) => {
                console.log('onCancel');
                evt.preventDefault();
                this.props.history.goBack();
              }}
              onSave={(evt) => {
                console.log('onSave');
                this.handleSubmit(evt);
              }}
              cancelBtnLabel="Cancel"
              saveBtnLabel="Save"
              cancelButtonDisable={false}
              saveButtonDisable={!this.props.form.valid}
              containerStyles=""
            ></FormFooter>  
          </form>
        </div>
      </div>
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
