import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
import logger from 'exm-logger';

// Components
import DropDownList from './dropdown-list';
import TextInput from '../text-input/text-input';

//Styles
import CSS from './dropdown.module.sass';

// Img
// import down_arrow from 'img/arrow-down.svg';
// import up_arrow from 'img/arrow-up.svg';
import down_arrow from '../../../styles/svg/arrow-down.svg';
import up_arrow from '../../../styles/svg/arrow-up.svg';

export default class DropDown extends React.Component {
  constructor(){
    super();

    this.state = {
      navigationIndex: 0,
      navigationItem: {},
      active: false,
      item: {
        value: '',
        display: '',
      },
      value: '',
      showErrorMessage: false,
    };

    this.forceSelection = false;

    this.enableDropDown = this.toggleDropDown.bind(this, 'open');
    this.disableDropDown = this.toggleDropDown.bind(this, 'close');
    this.handleSelection = this.handleSelection.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.renderSelectionCont = this.renderSelectionCont.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.isValueValid = this.isValueValid.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }
  
  handleOnKeyDown(event) {
    const { keyCode } = event;
    
    switch (keyCode) {
      case 38: {
        if (this.state.navigationIndex > 0) {
          this.setState((state) => {
            return {
              navigationIndex: state.navigationIndex - 1,
              navigationItem: this.props.options[state.navigationIndex - 1],
            };
          });
        }
      }
      break;
      
      case 40: {
        if (this.state.navigationIndex < this.props.options.length - 1) {
          this.setState((state) => {
            return {
              navigationIndex: state.navigationIndex + 1,
              navigationItem: this.props.options[state.navigationIndex + 1],
            };
          });
        }
      }
      break;
      
      case 13: {
        this.handleSelection(event, this.state.navigationItem);
      }
      break;
      
      default:
        return;
    }
  }

  toggleDropDown(action, e){
    switch (action){
      case 'close':
        if (this.forceSelection) {
          this.forceSelection = false;
          const newValue = this.state.item.display;
          this.setState({ value: newValue });

          if (this.props.onClick) {
            this.props.onClick(e, this.props.inputName, this.state.item);
          }
        }
        // will be executed onBlur
        document.removeEventListener('click', this.handleDocumentClick);
        // This is being done because the Inputs onBlur event happens first
        // and if i hide the dropdown list the click event will never be executed
        setTimeout(() => {
          this.setState({ active: false, showErrorMessage: !this.isValueValid() });
        }, 200);
        break;
      default:
        //  will be executed onFocus
        document.addEventListener('click', this.handleDocumentClick);
        // when focusing the input in a very sligth second it trigger a blur
        //so the timeout of the blurr was happening after this, which caused a bug
        setTimeout(() => {
          this.setState({ active: true, showErrorMessage: false });
        }, 200);
        break;
    }
  }

  isValueValid() {
    if (this.state.value && !this.forceSelection) {
      return !!this.props.options.find((option) => {
        const lowerCaseValue = this.state.value.toLowerCase();
        const lowerCaseOptionValue = get(option, 'display', '');
        return lowerCaseOptionValue.toLowerCase() === lowerCaseValue;
      })
    }
    return false;
  }

  handleSelection(e, item){
    this.forceSelection = false;

    if (this.props.onClick) {
      this.props.onClick(e, this.props.inputName, item);
    }

    this.setState({ value: item.display, item });
    this.disableDropDown();
  }

  onInputChange (e, inputName, value) {
    this.forceSelection = true;
    this.setState({ [inputName]: value });
  }

  handleDocumentClick() {
    this.disableDropDown();
  }

  handleOutsideClick(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  renderSelectionCont() {
    if (!this.state.active) return;

    const { options } = this.props;
    if (!options.length) {
      logger.warn('options passed to dropdown are empty')
    }

    //Search Implementation
    const searchResult = this.state.value ? // if value is not Empty
      options.reduce((acc, curr) => { // try finding the entered value in the list
        const display = curr.display.toLowerCase();
        const optionsValue = curr.value.toLowerCase();
        const value = this.state.value.toLowerCase();

        if (display.includes(value) || optionsValue.includes(value)) {
          return [ ...acc, curr]
        }
        return acc
      }, []) :
      options; // if value === empty use all options in list

    return (
      <DropDownList
        navigationIndex={this.state.navigationIndex}
        options={searchResult}
        onClick={this.handleSelection}
        displayField={this.props.displayField} />
    );
  }

  render(){
    const imgSrc = this.state.active ? up_arrow : down_arrow;
    const toggleList = this.state.active ? this.disableDropDown : this.enableDropDown;
    const containerClassName = classnames(CSS.container, {[this.props.containerClassName]: !!this.props.containerClassName})
    const iconClassName = classnames(CSS.icon, { [CSS.error]: this.state.showErrorMessage })

    return (
      <div
        className={containerClassName}
        onClick={this.handleOutsideClick}
        id={`dropdown_container_${this.props.id}`}
      >
        <div className={CSS.control}>
          <TextInput
            inputName='value'
            id={`dropdown_input_${this.props.id}`}
            containerClassName={this.props.containerClassName}
            onFocus={this.enableDropDown}
            onClick={this.enableDropDown}
            onKeyDown={this.handleOnKeyDown}
            onBlur={this.disableDropDown}
            onInputChange={this.onInputChange}
            label={this.props.label}
            value={this.state.value}
            type='text'
            error={this.state.showErrorMessage ? this.props.error : ''}
          />
          <img
            className={iconClassName}
            onClick={toggleList}
            src={imgSrc}
            id={`dropdown_icon_${this.props.id}`}
          />
        </div>
        {this.renderSelectionCont()}
      </div>
    );
  }
}

DropDown.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
     display: PropTypes.string.isRequired,
     value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  ),
  containerClassName: PropTypes.string,
};
DropDown.defaultProps = {
  containerClassName: '',
  error: 'Select an option from the dropdown.',
  label: '',
  id: '',
  inputName: '',
  value: '',
  options: [
    { display: 'No results Found', value: 'Default' },
  ],
};
