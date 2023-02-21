import React from 'react';
import {resilienceStatus} from '.';
import Loader, {LoaderModes} from '@axa-fr/react-toolkit-loader';
import './withResilience.scss';
import useProjectTranslation from '../../../translations/useProjectTranslation';

export const withResilience = Component => ({status, loaderText = null, ...otherProps}) => {
    const {translate} = useProjectTranslation();
    const {ERROR, SUCCESS, LOADING, POST, FORBIDDEN} = resilienceStatus;
    return (
        <>
            {
                {
                    [LOADING]: <Loader mode={LoaderModes.get} text={loaderText}><Component
                        loaderMode={LoaderModes.get} {...otherProps} /></Loader>,
                    [POST]: <Loader mode={LoaderModes.get} text={loaderText}> <Component
                        loaderMode={LoaderModes.post} {...otherProps} /></Loader>,
                    [ERROR]: (
                        <div className="resilience">
                            <div className="resilicience__error-message">
                                <p>{translate('resilience.error.first_part')}</p>
                                <br/>
                                <p>{translate('resilience.error.second_part')}</p>
                            </div>
                        </div>
                    ),
                    [FORBIDDEN]: (
                        <div className="resilience">
                            <div className="resilicience__error-message">
                                <p>{translate('resilience.forbidden')}</p>
                            </div>
                        </div>
                    ),
                    [SUCCESS]: <Component loaderMode={LoaderModes} {...otherProps} />
                }[status]
            }
        </>
    );
};
