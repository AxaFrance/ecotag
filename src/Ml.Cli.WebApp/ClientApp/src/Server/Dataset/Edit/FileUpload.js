import React from 'react';
import { File, FileTable } from '@axa-fr/react-toolkit-form-input-file';
import Button from '@axa-fr/react-toolkit-button';
import {resilienceStatus} from "../../shared/Resilience";
import {Locked} from "../Dataset.service";


const typeDatasetExtention = (datasetType) =>  {
    switch (datasetType){
        case "Image":
            return '.jpg, .jpeg, .png, .tiff';
        case "Text":
            return '.txt';
        default:
            return '.eml';
    }
}

const typeMimeDatasetExtention = (datasetType) =>  {
    switch (datasetType){
        case "Image":
            return 'image/jpeg, image/png, image/tiff';
        case "Text":
            return 'text/plain';
        default:
            return "message/rfc822,application/octet-stream";
    }
}

export const FileUpload = ({fetch, setState, state}) => {

    const onChange = values => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newFileLoads =  { values : [] };
            const filesLoadError = [];
            values.values.forEach(value => {
                const file = state.files.filesSend.find(f => f.file.name === value.file.name);
                if(file) {
                    filesLoadError.push(value);
                } else{
                    newFileLoads.values.push(value);
                }
            })
            
            setState({ 
                ...state, 
                files : { 
                    ...state.files, 
                    filesLoad: newFileLoads,
                    filesLoadError: filesLoadError
                }
            }
            );
        };
        reader.readAsDataURL(values.values[0].file);
    };

    const deleteFile = (idFile) => {
        const files = state.files;
        const filesLoad = files.filesLoad;
        let values = filesLoad.values;
        const file = values.find(v => v.id === idFile);
        const index = values.indexOf(file);
        const newValues = [...values];
        if (index > -1) {
            newValues.splice(index, 1);
        }
        setState({ ...state, files : { ...state.files, filesLoad: { values : newValues }  }});
    };

    const sendFile = async() => {
        setState({...state, status : resilienceStatus.POST });
            let i, j, temporary, chunk = 10;
        let files = state.files;
        const filesList = files.filesLoad.values;
            const promises = [];
            const promisesChunck = [];
            for (i = 0,j = filesList.length; i < j; i += chunk) {
                temporary = filesList.slice(i, i + chunk);
                const formData = new FormData();
                for (const value of temporary) {
                    formData.append('files', value.file);
                }
                const responsePromise = fetch(`datasets/${state.dataset.id}/files`, {
                    method: 'POST',
                    headers: {}, // This is necessary to override the default headers content-type: json
                    body: formData,
                });
                promises.push(responsePromise);
                promisesChunck.push(responsePromise);
                if(promisesChunck.length >= 10){
                    await Promise.all(promisesChunck);
                    promisesChunck.length = 0;
                }
            }

        const responses = await Promise.all(promises);
            if(responses.find(response => response.status >= 500)){
                setState({...state, status : resilienceStatus.ERROR });
            }
            else if (responses.find(response => response.status === 403)){
                setState({...state, status : resilienceStatus.FORBIDDEN});
            }
            else {
                const filesSendError = [];
                const newFilesSend = files.filesSend;
                let index = 0
                for (const response of responses) {
                    const filesResponse = await response.json();
                    filesResponse.forEach(file =>{
                        if(file.isSuccess)  {
                            const newFile = {...files.filesLoad.values[index]};
                            newFile.file.id = file.data;
                            newFilesSend.push(newFile);
                        } else{
                            const newFile = {...files.filesLoad.values[index]};
                            filesSendError.push(newFile);
                        }
                        index++;
                    });
                }
                setState({...state, files: {...files, filesLoad: [], filesSend: newFilesSend, filesSendError}});
            }
    };

    return (
        <>
            <div className={`edit-dataset__file-upload-container edit-dataset__file-upload-container--${state.dataset.locked !== Locked.None ? 'disabled' : ''}`}>
                <h2 className="edit-dataset__file-upload-title">Upload des fichiers {typeDatasetExtention(state.dataset.type)}</h2>
                <File
                    id='file'
                    name='datasetUploadFiles'
                    onChange={onChange}
                    multiple={true}
                    isVisible={true}
                    readOnly={false}
                    disabled={false}
                    accept={typeMimeDatasetExtention(state.dataset.type)}
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
            {state.files.filesLoadError.length === 0 ? null :
                <ul className="edit-dataset__file-upload-files-load-error">
                    {state.files.filesLoadError.map(file =>
                    <li><span>Le fichier {file.file.name} existe déjà</span></li>
                    )}
                </ul>
            }
            {state.files.filesSendError.length === 0 ? null :
                <ul className="edit-dataset__file-upload-files-load-error">
                    {state.files.filesSendError.map(file =>
                    <li><span>Le fichier {file.file.name} na pas pu être uploadé</span></li>
                    )}
                </ul>
            }
        </>
    );
};

export default FileUpload;
