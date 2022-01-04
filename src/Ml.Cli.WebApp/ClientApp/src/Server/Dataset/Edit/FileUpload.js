import React from 'react';
import { File, FileTable } from '@axa-fr/react-toolkit-form-input-file';
import Button from '@axa-fr/react-toolkit-button';
import cuid from 'cuid';
import {computeNumberPages, filterPaging} from "../../shared/filtersUtils";

export const FileUpload = ({setState, state}) => {

    const onChange = value => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setState({ ...state, filesLoad: value, fileData: reader.result, isSend: !state.isSend });
        };
        reader.readAsDataURL(value.values[0].file);
    };

    const deleteFile = () => {
        setState({ ...state, filesLoad: [] });
    };

    const sendFile = () => {
        const newFilesSend = state.filesSend;
        state.filesLoad.values.map(file => {
            const newFile = {...file, id: cuid()};
            newFilesSend.push(newFile);
        });
        setState({...state, filesLoad: [], filesSend: newFilesSend, paging: {
                numberPages: computeNumberPages(state.filesSend, state.paging.itemByPages),
                currentPages: 1,
                itemByPages: 5,
                itemFiltered: filterPaging(newFilesSend, state.paging.itemByPages, state.paging.currentPages)
            }});
    };

    return (
        <>
            <div className={`edit-dataset__file-upload-container edit-dataset__file-upload-container--${state.isLock ? 'disabled' : ''}`}>
                <h2 className="edit-dataset__file-upload-title">Upload des fichiers</h2>
                <File
                    id='file'
                    name='datasetUploadFiles'
                    onChange={onChange}
                    multiple={true}
                    isVisible={true}
                    readOnly={false}
                    disabled={false}
                    label="Parcourir"
                    icon='open'
                />
                {state.filesLoad.length === 0 ? '' : <FileTable errors={[]} values={state.filesLoad.values} onClick={deleteFile} />}
                <div>
                    <Button
                        name="sendFiles"
                        id="sendFiles"
                        onClick={sendFile}
                        disabled={state.filesLoad.length === 0}
                        classModifier={state.filesLoad.length === 0 ? 'disabled' : ''}>
                        <span className="af-btn__text">Envoyer</span>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default FileUpload;
