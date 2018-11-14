import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// import onKey from 'helpers/key';

// Styles
import CSS from './dropdown.module.sass'

export default function DropDownList(props) {
  const handleClick = (e, item) => {
    if (props.onClick) {
      return props.onClick(e, item)
    }
  }

  if (!props.options.length) {
    return <li className={CSS.itemNotFound} >No results Found</li>
  }

  let options = props.options.map((item, idx) => {
    return(
      <li
        className={`${CSS.item} ${props.navigationIndex === idx ? CSS.active : ''}`}
        id={`dropdown_list_item_${idx}`}
        key={idx}
        role="menuitem"
        aria-label={item.display}
        // onKeyDown={onKey('13 32', e => handleClick(e, item), false)}
        onMouseDown={e => handleClick(e, item)}
      >
        {item.display}
      </li>
    );
  });

  const className = classnames(CSS.options, { [props.optionsClassName]: props.optionsClassName })
  return (
    <ul className={className} role="menu">
      {options}
    </ul>
  );
}

DropDownList.propTypes = {
  navigationIndex: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  optionsClassName: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  )
};

DropDownList.defaultProps = {
  navigationIndex: 0,
  className: '',
  optionsClassName: '',
};
