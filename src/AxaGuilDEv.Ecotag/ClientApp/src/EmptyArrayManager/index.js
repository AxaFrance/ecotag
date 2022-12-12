import React from "react";
import './EmptyArrayManager.scss';

const EmptyArrayManager = ({items, emptyArrayMessage, children}) =>
    <>
        {items.length ? (
            <>{children}</>
        ) : (
            <span className="empty-array__error"><b>{emptyArrayMessage}</b></span>
        )
        }
    </>

export default EmptyArrayManager;