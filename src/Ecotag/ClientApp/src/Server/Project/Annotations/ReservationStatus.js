import {resilienceStatus} from "../../shared/Resilience";
import React from "react";

import "./ReservationStatus.scss";

export const ReservationStatus = ({status}) => {
    const {ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    if (SUCCESS === status) {
        return null;
    }
    return (
        <div className="reservation-status"
             style={{"backgroundColor": (status === POST || status === LOADING) ? "blue" : "red"}}>
            {
                {
                    [LOADING]: <span>Réservation éléments suivant en cours</span>,
                    [POST]: <span>Réservation élément suivant en cours</span>,
                    [ERROR]: (
                        <span>Erreur lors du chargement</span>
                    ),
                    [SUCCESS]: null
                }[status]
            }
        </div>
    );
}