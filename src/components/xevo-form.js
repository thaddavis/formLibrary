import React from 'react';
import { connect } from 'react-redux';

const p = console.log;

class XevoForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
    this.handleOnBlur = props.onBlur ? props.onBlur : this.handleOnBlur.bind(this);
    this.handleOnChange = props.onChange ? props.onChange : this.handleOnChange.bind(this);
  }

  renderWrappedChildren(children) {
    return React.Children.map(children, (child) => {
      // This is support for non-node elements (eg. pure text), they have no props
      if (!React.isValidElement(child)) {
        return child
      }
  
      if (child.props.children && child.props.formKey) {
        return React.cloneElement(child, {
          children: this.renderWrappedChildren(child.props.children),
          onChange: this.handleOnChange,
          onBlur: this.handleOnBlur,
          data: this.props.form ? this.props.form.values : undefined,
          errors: this.props.form ? this.props.form.errors : undefined,
          touched: this.props.form ? this.props.form.touched : undefined
        })
      } else if (child.props.children) {
        return React.cloneElement(child, {
          children: this.renderWrappedChildren(child.props.children),
        })
      } else if (child.props.formKey) {
        return React.cloneElement(child, {
          onChange: this.handleOnChange,
          onBlur: this.handleOnBlur,
          data: this.props.form ? this.props.form.values : undefined,
          errors: this.props.form ? this.props.form.errors : undefined,
          touched: this.props.form ? this.props.form.touched : undefined
        })
      } else {
        return React.cloneElement(child, {})
      }
      
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // p('shouldComponentUpdate')
    // p(nextProps);
    // p(nextState);
    
    // if (nextProps.form && nextProps.form.valid) {
    //   if (this.props.disableSave) this.props.disableSave(false); 
    // } else {
    //   if (this.props.disableSave) this.props.disableSave(true);
    // }

    return true;
  }

  handleOnBlur(e, formKey, value) {
    this.props.formActions.blurField({
      formId: this.props.formId,
      field: formKey,
      value,
      schema: this.props.schema,
      values: this.props.form && this.props.form.values,
    });
  }

  handleOnChange(e, formKey, value) {
    this.props.formActions.changeField({
      formId: this.props.formId,
      field: formKey,
      value,
      schema: this.props.schema,
      values: Object.assign({}, this.props.form && this.props.form.values),
    });
  }

  render() {
    const childrenWithProps = this.renderWrappedChildren(this.props.children)
    
    return <div>
      { childrenWithProps }
    </div>
  }

}

function mapStateToProps(state, ownProps) {

  p('mapStateToProps');
  p(state);
  p(ownProps);

  return {
    form: state.form[ownProps.formId]
  };

}

function mapDispatchToProps(dispatch) {

  return {
    formActions: {
      blurField: dispatch.form.blurField,
      changeField: dispatch.form.changeField,
      setFields: dispatch.form.setFields,
      resetForm: dispatch.form.reset,
      validateForm: dispatch.form.validateForm
    }
  };

}

export default connect(mapStateToProps, mapDispatchToProps)(XevoForm);