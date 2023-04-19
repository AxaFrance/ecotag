import {resilienceStatus} from "../../shared/Resilience";
import React from "react";

import "./ReservationStatus.scss";
import useProjectTranslation from "../../../translations/useProjectTranslation";

export const ReservationStatus = ({status}) => {
    const {translate} = useProjectTranslation('toolkit');
    const {ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    if (SUCCESS === status) {
        return null;
    }
    return (
        <div className="reservation-status"
             style={{"backgroundColor": (status === POST || status === LOADING) ? "blue" : "red"}}>
            {
                {
                    [LOADING]: <span>{translate('annotation_status.loading')}</span>,
                    [POST]: <span>{translate('annotation_status.post')}</span>,
                    [ERROR]: (
                        <span>{translate('annotation_status.error')}</span>
                    ),
                    [SUCCESS]: null
                }[status]
            }
        </div>
    );
}