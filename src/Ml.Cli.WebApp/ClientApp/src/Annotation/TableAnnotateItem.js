import React from "react";
import AnnotationImagesLoader from "./AnnotationImagesLoader";
import './TableAnnotateItem.scss';

const TableAnnotateItem = ({parentState, item, MonacoEditor, fetchFunction}) => {

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
                fetchFunction={fetchFunction}
            />
        </div>
    );
};

export default TableAnnotateItem;
