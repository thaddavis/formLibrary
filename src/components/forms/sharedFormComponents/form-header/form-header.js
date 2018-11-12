import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import i18n from 'utils/i18n/i18n';

import { withRouter } from 'react-router-dom';

import BackIcon from '../../../../styles/svg/back_arrow.svg';

import CSS from './form-header.module.sass';

class FormHeader extends Component {

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const backText = 'Back';
    const hasBackButton = true;

    return (
      <div className={CSS.modalHeader}>
        <span
          tabIndex={0}
          aria-label={backText}
          // onKeyDown={onKey('13 32', this.goBack, false)}
          className={CSS.backContainer}
          onClick={this.goBack}
          id="form_view_back_button"
        >
          {hasBackButton && <img className={CSS.backIcon} src={BackIcon} alt="go back" />}
          {backText}
        </span>
        <h1
          tabIndex={0}
          // aria-label={this.props.titleOverride}
          className={`${CSS.headerTitle} ${CSS.center}`}>
          {this.props.title}
        </h1>
      </div>
    );
  }
}

export default withRouter(FormHeader);