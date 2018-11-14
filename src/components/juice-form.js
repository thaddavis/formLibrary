import React from 'react';
import get from 'lodash/get';

const p = console.log;

class JuiceForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnBlur = props.onBlur ? props.onBlur : this.handleOnBlur.bind(this);
    this.handleOnChange = props.onChange ? props.onChange : this.handleOnChange.bind(this);
    this.renderUiSchema = this.renderUiSchema.bind(this);
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

  handleOnChange(e, inputName, value) {
    this.props.formActions.changeField({
      formId: this.props.formId,
      field: inputName,
      value,
      schema: this.props.schema,
      values: Object.assign({}, this.props.form && this.props.form.values),
    });
  }

  renderUiSchema(uiSchema, props) {
    
    if (
      uiSchema.type === 'array'
    ) {
      const content = [];

      if (props.data && props.data.length) {
        for (let i = 0; i < props.data.length; i += 1) {
          const Tmp = uiSchema.items.type;
          const newPath = props.path === '' ? i.toString() : `${props.path}.${i}`;
          content.push(<Tmp key={i} onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched} />);
        }
        return <div>
          { content }
        </div>;
      }

      const Tmp = uiSchema.items.type;
      const newPath = props.path === '' ? '0' : `${props.path}.${'0'}`;
      content.push(<Tmp key="0" onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched}/>);
      return <div className="here">{ content }</div>;
    } else if (uiSchema.type === 'object') {
      const content = Object.keys(uiSchema.items).map((objKey, i) => {
        const Tmp = uiSchema.items[objKey].component;
        const newPath = props.path === '' ? objKey : `${props.path}.${objKey}`;

        if (uiSchema.items[objKey].dependsOn) {
          
          let showUiElement = true;
          for (let i = 0; i < uiSchema.items[objKey].dependsOn.length; i++) {

            if (!props.data[ uiSchema.items[objKey].dependsOn[i] ]) {
              showUiElement = false;
              break;
            }

          }

          if (showUiElement) {
            return <Tmp key={newPath} onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched} />;
          } else {
            return null;
          }
        }

        return <Tmp key={newPath} onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched} />;
      });

      return <div>{ content }</div>;
    } else if (uiSchema.type === 'field') {
      return 'field';
    }

    throw new Error('unsupported uiSchema type');

  }

  render() {

    return this.renderUiSchema();

  }
}

export default JuiceForm;
