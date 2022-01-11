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

    const deleteFile = (idFile) => {
        console.log("test")
        console.log(state)

        const file = state.filesLoad.values.find(v => v.id === idFile);
        const index = state.filesLoad.values.indexOf(file);
        const newValues = [...state.filesLoad.values];
        if (index > -1) {
            newValues.splice(index, 1);
        }
        
        setState({ ...state, filesLoad: { values : newValues }  });
    };

    const sendFile = async() => {
        
            let i, j, temporary, chunk = 10;
            const array = state.filesLoad.values;
        const promises = [];
            for (i = 0,j = array.length; i < j; i += chunk) {
                temporary = array.slice(i, i + chunk);
               
                const formData = new FormData();
                
                for (const value of temporary) {
                    formData.append('files', value.file);
                   
                }
                const responsePromise = fetch(`/api/server/datasetfiles/${state.dataset.id}`, {
                    method: 'POST',
                    mode: 'no-cors',
                    header: {
                        'content-type': 'multipart/form-data',
                    },
                    body: formData,
                });
                promises.push(responsePromise)
            }
            
            await Promise.all(promises);

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
                    
                </div>
                
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
