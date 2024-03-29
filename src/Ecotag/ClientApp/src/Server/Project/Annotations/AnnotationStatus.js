import {resilienceStatus} from "../../shared/Resilience";
import React from "react";

import "./AnnotationStatus.scss";
import useProjectTranslation from "../../../useProjectTranslation";

export const AnnotationStatus = ({status}) => {
    const {translate} = useProjectTranslation('toolkit');
    const {ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    if (SUCCESS === status) {
        return null;
    }
    return (
        <div className="annotation-status" style={{"backgroundColor": status === LOADING ? "green" : "red"}}>
            {
                {
                    [LOADING]: <span>{translate('annotation_status.loading')}</span>,
                    [POST]: <span>{translate('annotation_status.post')}</span>,
                    [ERROR]: <span>{translate('annotation_status.error')}</span>,
                    [SUCCESS]: null
                }[status]
            }
        </div>
    );
}