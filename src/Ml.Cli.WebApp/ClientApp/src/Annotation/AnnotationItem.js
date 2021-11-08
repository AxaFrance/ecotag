import React, {useEffect} from "react";
import AnnotationImagesLoader from "./AnnotationImagesLoader";
import './AnnotationItem.scss';

const AnnotationItem = ({parentState, item, MonacoEditor, onSubmit, fetchFunction}) => {

    useEffect(() => {
        console.log("youhouAnnotationItem")
    }, []);
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

export default React.memo(AnnotationItem);
