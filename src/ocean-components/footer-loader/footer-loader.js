import React from 'react';
import PropTypes from 'prop-types';

// styles
import CSS from './footer-loader.module.sass'

function FormLoader({ showLoader }) {
  const className =[CSS.formLoader]
  if (showLoader) {
    className.push(CSS.open);
  } else {
    className.push(CSS.close);
  }
  return (
    <div className={className.join(' ')}>
      <div className={`${CSS.loaderLine} ${CSS.aLoop}`} />
    </div>
  );
}

FormLoader.defaultProps = {
  showLoader: false,
}

FormLoader.propTypes = {
  showLoader: PropTypes.bool,
}

export default FormLoader;
