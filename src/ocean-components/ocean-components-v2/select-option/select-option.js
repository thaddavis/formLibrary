import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
// import logger from 'exm-logger';

// Components
import DropDownList from '../dropdown/dropdown-list';

// Styles
import CSS from './select-option.module.sass';

// Img
import down_arrow from '../../../styles/svg/arrow-down.svg';
import up_arrow from '../../../styles/svg/arrow-up.svg';

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
    this.renderSelectionCont = this.renderSelectionCont.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  handleOnKeyDown(event) {
    const { keyCode } = event;

    switch (keyCode) {
      case 38: {
        if (this.state.navigationIndex > 0) {
          this.setState((state) => ({
            navigationIndex: state.navigationIndex - 1,
            navigationItem: this.props.options[state.navigationIndex - 1],
          }));
        }
      }
        break;

      case 40: {
        if (this.state.navigationIndex < this.props.options.length - 1) {
          this.setState((state) => ({
            navigationIndex: state.navigationIndex + 1,
            navigationItem: this.props.options[state.navigationIndex + 1],
          }));
        }
      }
        break;

      case 13: {
        this.handleSelection(event, this.state.navigationItem);
      }
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
    this.setState({ value: item.display, item });
    this.props.onChange(e, this.props.formKey, item.value);
    this.disableDropDown();
  }

  handleDocumentClick() {
    this.disableDropDown();
  }

  handleOutsideClick(e) {
    this.props.onBlur(e, this.props.formKey, this.state.item.value);
    e.nativeEvent.stopImmediatePropagation();
  }

  renderSelectionCont() {
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

  // error() {
  //   const className = classnames({ [CSS.errorMessage]: this.state.error }, { [CSS.warnMessage]: this.props.showWarning });

  //   if (this.props.showWarning) {
  //     return (
  //       <div className={className}>
  //         {this.props.showWarning}
  //       </div>
  //     );
  //   }

  //   if (this.props.showErrorMessage && this.props.error && !this.state.active) {
  //     return (
  //       <div className={CSS.errorMessage}>
  //         {this.props.error}
  //       </div>
  //     );
  //   }
  //   return null;
  // }

  error() {
    console.log('select-option   error()');

    let errors = get(this.props.errors, this.props.formKey);
    
    if (errors && errors[0]) {
      return (
        <div className={classnames(CSS.errorMessage)}>
          { errors[0].code }
          <br />
        </div>
        // errors.map((e, index) => (
        //   <div key={index} className={classnames(CSS.errorMessage)}>
        //     { e.code }
        //     <br />
        //   </div>
        // ))
      );
    }

    return (
      <div />
    );
  }

  handleKeyDown(e) {
    e.preventDefault();
  }

  onFocus(e) {
    if (this.state.active) {
      return;
    }
    this.setState({ active: true, focused: true });
  }

  onBlur(e) {
    console.log('select-option   onBlur');
    if (!this.state.active) {
      return;
    }
    this.setState({ active: false, focused: false });
    
    this.props.onBlur(e, this.props.formKey, this.state.item.value);

  }

  render() {
    const imgSrc = this.state.active ? up_arrow : down_arrow;
    const containerClassName = classnames(CSS.container, { [this.props.containerClassName]: !!this.props.containerClassName });
    const toggleList = this.state.active && !this.state.focused ? this.disableDropDown : this.enableDropDown;
    const inputAnimation = classnames(
      CSS.textInput,
      { [CSS.animationInputTitle]: this.state.active },
      { [CSS.error]: (this.props.showErrorMessage && !!this.props.error && !this.state.active) },
      { [CSS.animateBar]: this.state.active },
      { [CSS.warning]: this.props.showWarning },
    );

    return (
      <div className={containerClassName} onClick={this.handleOutsideClick} id={`select_option_container_${this.props.id}`}>
        <div className={CSS.control}>
          <div
            className={CSS.textInputContainer}
            onClick={toggleList}
            id={`select_option_textInput_container_${this.props.id}`}
          >
            <input
              aria-label={this.getAriaLabel()}
              className={inputAnimation}
              id={`select_option_input_${this.props.id}`}
              value={this.state.value}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onKeyDown={this.handleOnKeyDown}
              required="required"
            />
            <span className={CSS.bar} />
            <label className={CSS.labelText} htmlFor={`select_option_input_${this.props.id}`}>{this.props.label}</label>
            {this.error()}
          </div>
          <img
            className={CSS.icon}
            onClick={toggleList}
            id={`select_option_dropdown_icon_${this.props.id}`}
            src={imgSrc}
          />
        </div>
        {this.renderSelectionCont()}
      </div>
    );
  }
}

SelectOption.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  onClick: PropTypes.func,
  error: PropTypes.string,
  showErrorMessage: PropTypes.bool,
  showWarning: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    display: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired),
  containerClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  dropDownListClassName: PropTypes.string.isRequired,
};
SelectOption.defaultProps = {
  showErrorMessage: false,
  showWarning: '',
  error: 'Select an option from the dropdown.',
  containerClassName: '',
  dropDownListClassName: '',
  inputName: '',
  label: '',
  value: '',
  id: '',
  options: [
    { display: 'No results Found', value: 'Default' },
  ],
};

