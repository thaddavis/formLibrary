import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
// import logger from 'exm-logger';

// Components
import DropDownList from '../dropdown/dropdown-list';
// import TextInput from '../text-input/text-input';

// Styles
import CSS from './select-option.module.sass';

// Img
import down_arrow from '../../../styles/svg/arrow-down.svg';
import up_arrow from '../../../styles/svg/arrow-up.svg';

import i18n from '../../../utils/i18n/i18n';

export default class SelectOption extends React.Component {
  constructor() {
    super();

    this.state = {
      navigationIndex: 0,
      navigationItem: {},
      active: false,
      item: {
        value: '',
        display: '',
      },
      focused: false,
      value: '',
      showErrorMessage: false,
      error: '',
    };
    this.enableDropDown = this.toggleDropDown.bind(this, 'open');
    this.disableDropDown = this.toggleDropDown.bind(this, 'close');
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.renderSelectionContent = this.renderSelectionContent.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let obj = nextProps.options.find(obj => obj.value === get(nextProps.data, nextProps.formKey));
    let index = nextProps.options.findIndex(obj => obj.value === get(nextProps.data, nextProps.formKey));
    
    console.log('select-option getDerivedStateFromProps');
    console.log(obj);
    console.log(index);
    console.log('---------')
    console.log(nextProps);
    console.log(prevState);

    if (prevState.focused === true) {
      return {}
    } else if (
      nextProps.touched && 
      get(nextProps.touched, nextProps.formKey) && 
      nextProps.data
    ) {
      let obj = nextProps.options.find(obj => obj.value === get(nextProps.data, nextProps.formKey));
      let index = nextProps.options.findIndex(obj => obj.value === get(nextProps.data, nextProps.formKey));
      
      if (obj && index > -1) {
        return {
          navigationIndex: index,
          navigationItem: obj,
          item: obj,
          value: obj.display
        };
      } else {
        return {
          navigationIndex: 0,
          navigationItem: {},
          item: {},
          value: ""
        };
      }
    }
    return {};
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  handleOnKeyDown(event) {
    const { keyCode } = event;

    switch (keyCode) {
      case 38:
        if (this.state.navigationIndex > 0) {
          this.setState((state) => ({
            navigationIndex: state.navigationIndex - 1,
            navigationItem: this.props.options[state.navigationIndex - 1],
          }));
        }
        break;

      case 40:
        if (this.state.navigationIndex < this.props.options.length - 1) {
          this.setState((state) => ({
            navigationIndex: state.navigationIndex + 1,
            navigationItem: this.props.options[state.navigationIndex + 1],
          }));
        }
        break;

      case 13:
        this.setState((state) => ({
          navigationIndex: state.navigationIndex,
          navigationItem: this.props.options[state.navigationIndex],
        }));
        this.handleSelection(event, this.props.options[this.state.navigationIndex]);
        break;

      default:
    }
  }

  getAriaLabel() {
    const item = this.props.options[this.state.navigationIndex];
    return get(item, 'display', '');
  }

  toggleDropDown(action, e) {
    switch (action) {
      case 'close':
        document.removeEventListener('click', this.handleDocumentClick);
        this.setState({ active: false });
        break;
      default:
        document.addEventListener('click', this.handleDocumentClick);
        this.setState({ active: true, showErrorMessage: false });
        break;
    }
  }

  isValueValid() {
    if (this.state.value) {
      return !!this.props.options.find((option) => {
        const lowerCaseValue = this.state.value.toLowerCase();
        const lowerCaseOptionValue = get(option, 'display', '');
        return lowerCaseOptionValue.toLowerCase() === lowerCaseValue;
      });
    }
    return false;
  }

  handleSelection(e, item) {
    console.log('select-option handleSelection');
    this.setState({ value: item.display, item });
    // this.props.onBlur(e, this.props.formKey, this.state.item.value);
    this.onBlur(e);
    this.props.onChange(e, this.props.formKey, item.value);
    // this.disableDropDown();
  }

  handleDocumentClick() {
    this.disableDropDown();
  }

  handleOutsideClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  renderSelectionContent() {
    if (!this.state.active) return;

    const { options } = this.props;
    if (!options.length) {
      // logger.error('options passed to select-option EMPTY');
    }

    return (
      <DropDownList
        navigationIndex={this.state.navigationIndex}
        options={options}
        optionsClassName={this.props.dropDownListClassName}
        onClick={this.handleSelection}
        displayField={this.props.displayField}
      />
    );
  }

  error() {
    let errors = get(this.props.errors, this.props.formKey);
    
    if (errors && errors[0]) {
      return (
        <div className={classnames(CSS.errorMessage)}>
          { i18n.t(errors[0].code, errors[0].params) }
          <br />
        </div>
      );
    }

    return (
      <div />
    );
  }

  onFocus(e) {
    console.log('select-option --- onFocus');
    if (this.state.active) {
      return;
    }
    this.setState({ active: true, focused: true });
  }

  onBlur(e) {
    console.log('select-option --- onBlur');
    if (!this.state.active) {
      return;
    }
    this.setState({ active: false, focused: false });
    this.props.onBlur(e, this.props.formKey, this.state.item.value);
    // this.disableDropDown();
  }

  render() {
    const imgSrc = this.state.active ? up_arrow : down_arrow;
    const containerClassName = classnames(
      CSS.container, 
      { [CSS.textInputContainer]: this.state.focused || this.state.value },
      { [CSS.textInputContainerIsNotFocusedOrDoesNotHaveValues]: !this.state.focused && !this.state.value }
    );
    
    const toggleList = this.state.active && !this.state.focused ? this.disableDropDown : this.enableDropDown;
    const inputAnimation = classnames(
      CSS.textInput,
      { [CSS.animationInputTitle]: this.state.active },
      { [CSS.error]: (this.props.showErrorMessage && !!this.props.error && !this.state.active) },
      { [CSS.animateBar]: this.state.active }
    );

    return (
      <div className={containerClassName} onClick={this.handleOutsideClick} id={`select_option_container_${this.props.id}`}>
        <div className={CSS.control}>
          <div
            className={CSS.inputContainer}
            onClick={toggleList}
            id={`select_option_textInput_container_${this.props.id}`}
          >
            <input
              aria-label={this.getAriaLabel()}
              className={inputAnimation}
              id={`select_option_input_${this.props.id}`}
              value={this.state.value}
              onFocus={this.onFocus}
              onClick={this.onFocus}
              onBlur={this.onBlur}
              onKeyDown={this.handleOnKeyDown}
              required="required"
              readOnly
            />
            <span className={CSS.bar} />
            <label 
              className={CSS.labelText} 
              htmlFor={`select_option_input_${this.props.id}`}
              onFocus={this.onFocus}
              onClick={this.onFocus}
            >{this.props.label}</label>
            {this.error()}
          </div>
          <img
            className={CSS.icon}
            onClick={toggleList}
            id={`select_option_dropdown_icon_${this.props.id}`}
            src={imgSrc}
            alt="dropdown"
          />
        </div>
        {this.renderSelectionContent()}
      </div>
    );
  }
}

SelectOption.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  containerClassName: PropTypes.string,
  dropDownListClassName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired),
};
SelectOption.defaultProps = {
  label: '',
  id: '',
  containerClassName: '',
  dropDownListClassName: '',
  value: '',
  options: [
    { display: 'No results Found', value: 'Default' },
  ],
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  touched: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

