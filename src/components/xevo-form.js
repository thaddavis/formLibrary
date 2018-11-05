import React from 'react';
import get from 'lodash/get';

const p = console.log;

class XevoForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnBlur = props.onBlur ? props.onBlur : this.handleOnBlur.bind(this);
    this.handleOnChange = props.onChange ? props.onChange : this.handleOnChange.bind(this);
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

  renderUiSchema(uiSchema, props) {
    // p('renderUiSchema');
    // p(uiSchema);
    // p(props);
    
    if (
      uiSchema.type === 'array'
    ) {
      const content = [];
      if (props.data) {
        for (let i = 0; i < props.data.length; i += 1) {
          const Tmp = uiSchema.items.type;
          const newPath = props.path === '' ? i.toString() : `${props.path}.${i}`;
          content.push(<Tmp key={i} onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched} />);
        }
        return <div>
          <hr />
          { content }
        </div>;
      }

      const Tmp = uiSchema.items.type;
      const newPath = props.path === '' ? '0' : `${props.path}.${'0'}`;
      content.push(<Tmp key="0" onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched}/>);
      return <div>{ content }</div>;
    } else if (uiSchema.type === 'object') {
      const content = Object.keys(uiSchema.items).map((objKey, i) => {
        const Tmp = uiSchema.items[objKey].component;
        const newPath = props.path === '' ? objKey : `${props.path}.${objKey}`;
        return <Tmp key={newPath} onBlur={props && props.onBlur} onChange={props && props.onChange} data={props && props.data} path={newPath} value={get(props && props.data, newPath)} errors={props && props.errors} touched={props && props.touched}/>;
      });

      return <div>{ content }</div>;
    } else if (uiSchema.type === 'field') {
      return 'field';
    }

    throw new Error('unsupported uiSchema type');

  }

  render() {

    return (
      <div>
        { this.renderUiSchema() }
      </div>
    );

  }
}

export default XevoForm;
