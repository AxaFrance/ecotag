import React from 'react';
import {resilienceStatus} from '.';
import Loader, {LoaderModes} from '@axa-fr/react-toolkit-loader';
import './withResilience.scss';
import useProjectTranslation from '../../../useProjectTranslation';

export const withResilience = Component => ({status, loaderText = null, ...otherProps}) => {
    const {translate} = useProjectTranslation();
    const {ERROR, SUCCESS, LOADING, POST, FORBIDDEN} = resilienceStatus;

    const setLoaderText = (loaderText, loaderMode) => {
        let result;
        if(loaderText !== null){
            return loaderText;
        }
        switch (loaderMode){
            case LoaderModes.get:
                result = translate('resilience.get');
                break;
            case LoaderModes.post:
                result = translate('resilience.post');
                break;
            default:
                result = null;
                break;
        }
        return result;
    }

    return (
        <>
            {
                {
                    [LOADING]: <Loader mode={LoaderModes.get} text={setLoaderText(loaderText, LoaderModes.get)}><Component
                        loaderMode={LoaderModes.get} {...otherProps} /></Loader>,
                    [POST]: <Loader mode={LoaderModes.get} text={setLoaderText(loaderText, LoaderModes.post)}> <Component
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
