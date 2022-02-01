import {resilienceStatus} from "../../shared/Resilience";
import React from "react";

export const AnnotationStatus = ({status}) => {
    const {ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    if (SUCCESS === status) {
        return null;
    }
    return (
        <div className="reservation-status" style={{
            position: "fixed",
            "z-index": 100000,
            top: "0px",
            right: "0px",
            "backgroundColor": status === LOADING ? "green" : "red",
            color: "white"
        }}>
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