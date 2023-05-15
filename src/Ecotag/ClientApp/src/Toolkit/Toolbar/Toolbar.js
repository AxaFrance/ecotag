import React from 'react';
import classNames from 'classnames';

import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import './Toolbar.scss';
import useProjectTranslation from "../../useProjectTranslation";

export const ToolbarButtonContainer = ({children, classModifier = undefined}) => {
    const name = 'toolbar__button-container';
    const className = classNames(name, {
        [`${name}--${classModifier}`]: classModifier,
    });
    return <div className={className}>{children}</div>;
};

export const ToolbarButton = ({onClick, icon, title, label, disabled, toggle = false, classModifier = undefined}) => {
    const name = 'toolbar__button-item';
    const className = classNames(name, {
        [`${name}--toggle`]: toggle,
        [`${name}--${classModifier}`]: classModifier,
    });
    return (
        <button title={title} className={className} disabled={disabled} onClick={onClick}>
            <span className={'glyphicon glyphicon-' + icon}/>
            <div className="toolbar__button-item-label">{label}</div>
        </button>
    );
};

export const ToolbarSwitchButton = ({onChange, checked, label, id, classModifier}) => {
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

export const ToolbarProgressButton = ({label, id, classModifier, ...otherProps}) => {
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

const Toolbar = ({isSubmitDisabled = false, onSubmit, onReset = undefined, children, classModifier}) => {

    const {translate} = useProjectTranslation('toolkit');

    const containerClassName = "toolbar"

    const className = classNames(containerClassName, {
        [containerClassName + "--" + classModifier]: classModifier,
    });

    return (
        <div className={className}>
            {children}
            <ToolbarButtonContainer classModifier="submit">
                {onReset && (
                    <button title={translate('cropping.toolbar.reset.title')}
                            className="toolbar__button-reset"
                            onClick={onReset}>
                        {translate('cropping.toolbar.reset.label')}
                    </button>
                )}
                <button
                    className="toolbar__button-submit"
                    title={translate('cropping.toolbar.submit.title')}
                    disabled={isSubmitDisabled}
                    onClick={onSubmit}>
                    {translate('cropping.toolbar.submit.label')}
                </button>
            </ToolbarButtonContainer>
        </div>
    );
};

export default React.memo(Toolbar);
