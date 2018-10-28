import React from 'react';
import PropTypes from 'prop-types';

// import Style from './footer-buttons.sass';

export default function FooterButtons(props) {
  const buttonStyle = props.saveButtonDisable ? 'inactive' : 'active';
  return (
    <div className={ props.containerStyles }>
      <button
        id="footer_buttons_cancel"
        disabled={ props.cancelButtonDisable }
        // className={ `${ Style.button } ${ Style[props.cancelBtnStyle] }` }
        onClick={ props.cancelBtnOnClick }
      >
        { props.cancelBtnLabel }
      </button>

      <button
        disabled={ props.saveButtonDisable }
        // className={ `${ Style.button } ${ Style[buttonStyle] }` }
        onClick={ props.saveBtnOnClick }
        id="footer_buttons_save"
      >
        { props.saveBtnLabel }
      </button>
    </div>
  );
}

function getDisabledStatus(style) {
  return style === 'inactive';
}

FooterButtons.defaultProps = {
  saveButtonDisable: true,
  cancelButtonDisable: false,
}

FooterButtons.propTypes = {
  saveButtonDisable: PropTypes.bool,
  cancelButtonDisable: PropTypes.bool,
  containerStyles: PropTypes.string,
  saveBtnOnClick: PropTypes.func.isRequired,
  saveBtnLabel: PropTypes.string.isRequired,
  cancelBtnLabel: PropTypes.string.isRequired,
  cancelBtnOnClick: PropTypes.func.isRequired,
}