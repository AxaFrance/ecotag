import React from 'react';
import { resilienceStatus } from '.';
import Loader, { LoaderModes } from '@axa-fr/react-toolkit-loader';

import './withResilience.scss';

export const withResilience = Component => ({ status, loaderText=null, ...otherProps }) => {
    const { ERROR, SUCCESS, LOADING, POST, FORBIDDEN } = resilienceStatus;
    return (
        <>
            {
                {
                    [LOADING]: <Loader mode={LoaderModes.get} text={loaderText} ><Component loaderMode={LoaderModes.get} {...otherProps} /></Loader>,
                    [POST]: <Loader mode={LoaderModes.get} text={loaderText}> <Component loaderMode={LoaderModes.post} {...otherProps} /></Loader>,
                    [ERROR]: (
                        <div className="resilience">
                            <div className="resilicience__error-message">
                                <p>Une erreur serveur est survenue.</p>
                                <br />
                                <p>Nous sommes au courant du problème. Une investigation est en cours...</p>
                            </div>
                        </div>
                    ),
                    [FORBIDDEN]: (
                        <div className="resilience">
                            <div className="resilicience__error-message">
                                <p>Vous n'avez pas le droit d'accéder à cette ressource.</p>
                            </div>
                        </div>
                    ),
                    [SUCCESS]: <Component loaderMode={LoaderModes} {...otherProps} />
                }[status]
            }
        </>
    );
};
