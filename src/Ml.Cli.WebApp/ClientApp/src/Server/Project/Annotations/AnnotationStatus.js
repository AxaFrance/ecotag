import {resilienceStatus} from "../../shared/Resilience";
import React from "react";

import "./AnnotationStatus.scss"

export const AnnotationStatus = ({status}) => {
    const {ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    if (SUCCESS === status) {
        return null;
    }
    return (
        <div className="annotation-status" style={{"backgroundColor": status === LOADING ? "green" : "red"}}>
            {
                {
                    [LOADING]: <span>Chargement élément suivant en cours</span>,
                    [POST]: <span>Sauvegarde en cours</span>,
                    [ERROR]: (
                        <span>Erreur lors du chargement</span>
                    ),
                    [SUCCESS]: null
                }[status]
            }
        </div>
    );
}