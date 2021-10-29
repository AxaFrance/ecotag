import React from "react";
import AnnotationImagesLoader from "./AnnotationImagesLoader";
import './AnnotationItem.scss';

const AnnotationItem = ({parentState, item, MonacoEditor, onSubmit, fetchFunction}) => {

    return (
        <div className="table-result">
            <div className="table-result__header">
                <div>
                    <p>File result: {item.fileName}</p>
                </div>
            </div>
            <AnnotationImagesLoader
                item={item}
                MonacoEditor={MonacoEditor}
                parentState={parentState}
                onSubmit={onSubmit}
                fetchFunction={fetchFunction}
            />
        </div>
    );
};

export default AnnotationItem;
