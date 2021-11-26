import React from 'react';
import classNames from 'classnames';

import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import './Toolbar.scss';

export const ToolbarButtonContainer = ({ children, classModifier = undefined }) => {
  const name = 'toolbar__button-container';
  const className = classNames(name, {
    [`${name}--${classModifier}`]: classModifier,
  });
  return <div className={className}>{children}</div>;
};

export const ToolbarButton = ({ onClick, icon, title, label, disabled, toggle=false, classModifier = undefined  }) => {
    const name = 'toolbar__button-item';
    const className = classNames(name, {
        [`${name}--toggle`]: toggle,
        [`${name}--${classModifier}`]: classModifier,
    });
  return (
    <button title={title} className={className} disabled={disabled} onClick={onClick}>
      <span className={'glyphicon glyphicon-' + icon} />
      <div className="toolbar__button-item-label">{label}</div>
    </button>
  );
};

export const ToolbarSwitchButton = ({ onChange, checked, label, id, classModifier }) => {
  const name = 'toolbar__button-switch-item';
  const className = classNames(name, {
    [`${name}--${classModifier}`]: classModifier,
  });
  return (
    <div className={className}>
      <input
        className="toolbar__button-switch-item-input"
        id={id}
        checked={checked}
        onChange={onChange}
        type="checkbox"
      />
      <label className="toolbar__button-switch-item-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export const ToolbarProgressButton = ({ label, id, classModifier, ...otherProps }) => {
  const name = 'toolbar__button-progress-item';
  const className = classNames(name, {
    [`${name}--${classModifier}`]: classModifier,
  });
  return (
    <div className={className}>
      <input className="toolbar__button-progress-item-input" id={id} type="range" name="width" {...otherProps} />
      <label className="toolbar__button-progress-item-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

const Toolbar = ({ isSubmitDisabled = false, onSubmit, onReset = undefined, children, classModifier }) => {

    const containerClassName = "toolbar"
    
    const className = classNames(containerClassName, {
        [containerClassName+ "--" + classModifier]:classModifier ,
    });
    
  return (
    <div className={className}>
      {children}
      <ToolbarButtonContainer classModifier="submit">
        {onReset && (
          <button className="toolbar__button-reset" onClick={onReset}>
            Reset
          </button>
        )}
        <button
          className="toolbar__button-submit"
          title="Raccourci : Ctrl + Barre espace"
          disabled={isSubmitDisabled}
          onClick={onSubmit}>
          Submit
        </button>
      </ToolbarButtonContainer>
    </div>
  );
};

export default React.memo(Toolbar);
