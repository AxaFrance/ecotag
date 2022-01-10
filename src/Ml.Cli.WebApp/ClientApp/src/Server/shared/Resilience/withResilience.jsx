import React from 'react';
import { resilienceStatus } from '.';
import withLoader from '../../withLoader';
import { LoaderModes } from '@axa-fr/react-toolkit-loader';

import './withResilience.scss';

export const withResilience = Component => ({ status, ...otherProps }) => {
    const { ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    const ComponentWithLoader = withLoader(Component);
    return (
        <>
            {
                {
                    [LOADING]: <ComponentWithLoader loaderMode={LoaderModes.get} {...otherProps} />,
                    [POST]: <ComponentWithLoader loaderMode={LoaderModes.post} {...otherProps} />,
                    [ERROR]: (
                        <div className="resilience">
                            <div className="resilicience__error-message">
                                <p>Une erreur serveur est survenue.</p>
                                <br />
                                <p>Nous sommes au courant du problème. Une investigation est en cours...</p>
                            </div>
                        </div>
                    ),
                    [SUCCESS]: <Component loaderMode={LoaderModes} {...otherProps} />
                }[status]
            }
        </>
    );
};
