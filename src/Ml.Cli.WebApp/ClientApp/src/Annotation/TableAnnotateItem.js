import React, {useEffect, useState} from "react";
import AnnotationImagesLoader from "./AnnotationImagesLoader";
import './TableAnnotateItem.scss';
import {useMutation} from "react-query";
import {fetchGetData, fetchPostJson} from "../FetchHelper";

const getHttpResultItem = async (item, fetchFunction) => {
    const params = {
        filePath: `${item.fileDirectory}\\${item.fileName}`
    };
    const fetchResult = await fetchGetData(fetchFunction)("api/annotations", params);
    if (fetchResult.status === 200) {
        const dataObject = await fetchResult.json();
        return {httpResult: dataObject, errorMessage: ""};
    }
    const errorMessage = `Requête invalide: ${fetchResult.statusText}`;
    return {errorMessage, httpResult: {}};
};

const TableAnnotateItem = ({item, MonacoEditor, fetchFunction}) => {
    const [state, setState] = useState({
        httpResultItem: {},
        errorMessage: "",
        isFetched: false
    });

    const mutationJson = useMutation(newData => fetchPostJson(fetchFunction)("/api/datasets/save", newData));

    useEffect(() => {
        getEditorContent();
    }, []);

    const getEditorContent = async () => {
        const {httpResult, errorMessage} = await getHttpResultItem(item, fetchFunction);
        setState({...state, errorMessage, httpResultItem: httpResult, isFetched: true});
    };

    const saveJson = editorContent => {
        const newHttpResultItem = state.httpResultItem;
        newHttpResultItem.body = editorContent;
        mutationJson.mutate(newHttpResultItem);
        setState({...state, httpResultItem: newHttpResultItem});
    };

    return (
        <div className="table-result">
            <div className="table-result__header">
                <div>
                    <p>Résultat fichier : {item.fileName}</p>
                </div>
            </div>
            {
                !state.isFetched &&
                <div>Chargement du fichier...</div>
            }
            {state.isFetched &&
            <AnnotationImagesLoader
                item={item}
                expectedOutput={{id: item.id, fileName: item.fileName, value: state.httpResultItem.body}}
                onSubmit={saveJson}
                MonacoEditor={MonacoEditor}
                fetchFunction={fetchFunction}
            />
            }
            {state.errorMessage &&
            <div className="error-message">{state.errorMessage}</div>
            }
        </div>
    );
};

export default TableAnnotateItem;
