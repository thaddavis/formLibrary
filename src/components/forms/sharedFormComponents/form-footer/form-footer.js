import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FooterButtons from '../../../../ocean-components/footer-buttons/footer-buttons';
// import FormLoader from '../../../../ocean-components/footer-loader/footer-loader';

// import i18n from 'utils/i18n/i18n';

import CSS from './form-footer.module.sass';

class FormFooter extends Component {
  render() {
    return (
      <div className={ `${ this.props.className ? this.props.className : '' } ${ CSS.footer }` }>
        {/* <FormLoader showLoader={ this.props.loading } /> */}
        <FooterButtons
          containerStyles={ `${ this.props.containerStyles ? this.props.containerStyles : '' } ${ CSS.buttons }` }
          cancelBtnOnClick={ this.props.onCancel }
          saveBtnOnClick={ this.props.onSave }
          cancelBtnLabel={ this.props.cancelBtnLabel }
          saveBtnLabel={ this.props.saveBtnLabel }
          cancelButtonDisable={ this.props.cancelButtonDisable }
          saveButtonDisable={ this.props.saveButtonDisable } />
      </div>
    );
  }
}

FormFooter.defaultProps = {
  className: '',
  loading: false,
  onCancel: Function.prototype,
  onSave: Function.prototype,
  cancelBtnLabel: 'cancel',
  saveBtnLabel: 'save',
  cancelButtonDisable: false,
  saveButtonDisable: false,
  containerStyles: '',
};

FormFooter.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  cancelBtnLabel: PropTypes.string,
  saveBtnLabel: PropTypes.string,
  cancelButtonDisable: PropTypes.bool,
  saveButtonDisable: PropTypes.bool,
  containerStyles: PropTypes.string,
};

export default FormFooter;