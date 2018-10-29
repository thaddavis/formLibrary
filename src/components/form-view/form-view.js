import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import FormFooter from '../form-footer/form-footer';

// import sessionActions from 'actions/session-actions';

// import i18n from 'utils/i18n/i18n';
import buildRoutes from '../../helpers/route-helper.js';
import onKey from '../../helpers/key';

// import BackIcon from 'img/back_arrow.svg';

import CSS from './form-view.sass';

export default function formViewHOC({
  WrappedComponent,
  backText,
  title,
  backPath,
  hasBackButton = true,
  hasFooter = true,
  hasHeader = true,
  saveButtonLabel = 'save',
  cancelButtonLabel = 'cancel',
  schema,
  formId,
}) {
  class FormView extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        cancelButtonDisable: false,
        saveButtonDisable: false,
        saveClickEvent: false,
        cancelClickEvent: false,
        isFooterVisible: false,
        loading: false,
      };

      this.onCancel = this.onCancel.bind(this);
      this.onSave = this.onSave.bind(this);
      this.cancel = this.cancel.bind(this);
      this.save = this.save.bind(this);
      this.disableSave = this.disableButton.bind(this, 'save');
      this.disableCancel = this.disableButton.bind(this, 'cancel');
      this.goBack = this.goBack.bind(this);
      this.toggleFooterVisibillity = this.toggleFooterVisibillity.bind(this);
      this.showLoading = this.showLoading.bind(this);
    }

    componentDidMount() {
      // this.props.sessionActions.hideHeader(true);
    }

    componentWillUnmount() {
      // this.props.sessionActions.hideHeader(false);
    }

    onCancel() {
      this.setState({ cancelClickEvent: true });
    }

    onSave() {
      this.setState({ saveClickEvent: true });
    }

    toggleFooterVisibillity(isVisible) {
      this.setState({ isFooterVisible: isVisible });
    }

    disableButton(type, value) {
      if (type === 'save') {
        this.setState({ saveButtonDisable: value });
      }
      if (type === 'cancel') {
        this.setState({ cancelButtonDisable: value });
      }
    }

    resetEventToOriginalState() {
      this.setState({ saveClickEvent: false, cancelClickEvent: false });
    }

    save(callback) {
      this.resetEventToOriginalState();
      if (!callback) return Promise.reject(Error('save(callback) didnt recieve any parameters'));
      return callback();
    }

    cancel(callback) {
      this.resetEventToOriginalState();

      if (!callback) {
        this.props.history.goBack();
      }
      return callback();
    }

    goBack() {
      if (this.props.shouldUseGoBack) {
        this.props.history.goBack();
        return;
      }

      this.props.history.push(this.props.backPathOverride || buildRoutes(backPath));
    }

    showLoading(status) {
      this.setState({ loading: status });
    }

    validate() {
        
    }

    renderHeader() {
      const backText = this.props.shouldUseGoBack ? '' : (this.props.backTextOverride || 'this.props.backText');

      return (
        <div className={CSS.modalHeader}>
          <span
            role="landmark"
            tabIndex={0}
            aria-label={backText}
            onKeyDown={onKey('13 32', this.goBack, false)}
            className={CSS.backContainer}
            onClick={this.goBack}
            id="form_view_back_button"
          >
            {
                hasBackButton && 'Back'
                // <img className={CSS.backIcon} src={BackIcon} alt="go back" />
            }
            <span className={`${CSS.headerTitle} ${CSS.isHiddenTablet}`} >
              {backText}
            </span>
          </span>
          <h1
            role="heading"
            tabIndex={0}
            aria-label={this.props.titleOverride || this.props.title}
            className={`${CSS.headerTitle} ${CSS.center}`}>
            {this.props.titleOverride || this.props.title}
          </h1>
        </div>
      );
    }

    renderFooter() {
      if (!this.props.hasFooter && !this.state.isFooterVisible) {
        return null;
      }

      const saveButtonLabel = this.props.saveButtonLabel;
      const cancelButtonLabel = this.props.cancelButtonLabel;

      return (
        <FormFooter
          loading={this.state.loading}
          onCancel={this.onCancel}
          onSave={this.onSave}
          cancelBtnLabel={cancelButtonLabel}
          saveBtnLabel={saveButtonLabel}
          cancelButtonDisable={this.state.cancelButtonDisable}
          saveButtonDisable={this.state.saveButtonDisable}
        />
      );
    }

    render() {
      return (
        <div>
          {this.renderHeader()}
          <div className={CSS.formViewContainer}>
            <WrappedComponent
              // makes sure component gets the router props
              {...this.props}
              disableSave={this.disableSave}
              disableCancel={this.disableCancel}
              saveClickEvent={this.state.saveClickEvent}
              cancelClickEvent={this.state.cancelClickEvent}
              toggleFooterVisibillity={this.toggleFooterVisibillity}
              save={this.save}
              cancel={this.cancel}
              showLoading={this.showLoading}
              schema={schema}
              formId={formId}
            />
          </div>
          {this.renderFooter(this.props.hasFooter)}
        </div>
      );
    }
  }

  FormView.defaultProps = {
    // coming from function arguments
    title,
    backText,
    hasFooter,
    hasHeader,
    titleOverride: '',
    backPathOverride: '',
    backTextOverride: '',
    saveButtonLabel,
    cancelButtonLabel,
    sessionActions: {
      hideHeader: Function.prototype,
    },
    history: {
      push: Function.prototype,
    },
  };

  FormView.propTypes = {
    hasFooter: PropTypes.bool,
    hasHeader: PropTypes.bool,
    title: PropTypes.string,
    backText: PropTypes.string,
    titleOverride: PropTypes.string,
    backPathOverride: PropTypes.string,
    backTextOverride: PropTypes.string,
    saveButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    sessionActions: PropTypes.shape({
      hideHeader: PropTypes.func,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
      goBack: PropTypes.func,
    }),
  };

  function mapStateToProps(state) {
    return {
      // titleOverride: state.header.titleOverride,
      // backPathOverride: state.header.backPathOverride,
      // backTextOverride: state.header.backTextOverride,
      // shouldUseGoBack: state.header.shouldUseGoBack,
      titleOverride: '',
      backPathOverride: '',
      backTextOverride: '',
      shouldUseGoBack: true
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      //sessionActions: bindActionCreators(sessionActions, dispatch),
    };
  }

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(FormView));
}
