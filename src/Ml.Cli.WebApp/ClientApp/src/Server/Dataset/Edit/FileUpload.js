import React from 'react';
import { File, FileTable } from '@axa-fr/react-toolkit-form-input-file';
import Button from '@axa-fr/react-toolkit-button';
import cuid from 'cuid';
import {resilienceStatus} from "../../shared/Resilience";

export const FileUpload = ({fetch, setState, state}) => {

    const onChange = value => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setState({ ...state, files : { ...state.files, filesLoad: value }});
        };
        reader.readAsDataURL(value.values[0].file);
    };

    const deleteFile = (idFile) => {
        const files = state.files;
        const filesLoad = files.filesLoad;
        const file = filesLoad.values.find(v => v.id === idFile);
        const index = filesLoad.values.indexOf(file);
        const newValues = [...filesLoad.values];
        if (index > -1) {
            newValues.splice(index, 1);
        }
        setState({ ...state, files : { ...state.files, filesLoad: { values : newValues }  }});
    };

    const sendFile = async() => {

        setState({...state, status : resilienceStatus.POST });
     
            let i, j, temporary, chunk = 10;
            const array = state.files.filesLoad.values;
            const promises = [];
            for (i = 0,j = array.length; i < j; i += chunk) {
                temporary = array.slice(i, i + chunk);
                const formData = new FormData();
                for (const value of temporary) {
                    formData.append('files', value.file);
                }
                const responsePromise = fetch(`datasets/${state.dataset.id}/files`, {
                    method: 'POST',
                    header: {
                        'content-type': 'multipart/form-data',
                    },
                    body: formData,
                });
                promises.push(responsePromise)
            }

        const responses = await Promise.all(promises);
            if(responses.find(response => response.status >= 500)){
                setState({...state, status : resilienceStatus.ERROR });
            } else {
                const newFilesSend = state.files.filesSend;
                state.files.filesLoad.values.map(file => {
                    const newFile = {...file, id: cuid()};
                    newFilesSend.push(newFile);
                });
                setState({...state, files: {...state.files, filesLoad: [], filesSend: newFilesSend}});
            }
    };

    return (
        <>
            <div className={`edit-dataset__file-upload-container edit-dataset__file-upload-container--${state.dataset.isLock ? 'disabled' : ''}`}>
                <h2 className="edit-dataset__file-upload-title">Upload des fichiers {state.dataset.type === "Image" ? '.jpg, .jpeg, .png, .tiff': '.txt'}</h2>
                <File
                    id='file'
                    name='datasetUploadFiles'
                    onChange={onChange}
                    multiple={true}
                    isVisible={true}
                    readOnly={false}
                    disabled={false}
                    accept={state.dataset.type === "Image" ? 'image/jpeg, image/png, image/tiff': 'text/plain'}
                    label="Parcourir"
                    icon='open'
                />
                {state.files.filesLoad.length === 0 ? '' : <FileTable errors={[]} values={state.files.filesLoad.values} onClick={deleteFile} />}
                <div>
                    <Button
                        name="sendFiles"
                        id="sendFiles"
                        onClick={sendFile}
                        disabled={state.files.filesLoad.length === 0}
                        classModifier={state.files.filesLoad.length === 0 ? 'disabled' : ''}>
                        <span className="af-btn__text">Envoyer</span>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default FileUpload;
