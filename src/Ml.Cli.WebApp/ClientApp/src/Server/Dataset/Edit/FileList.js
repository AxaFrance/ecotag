import React from 'react';
import Table, {Paging} from '@axa-fr/react-toolkit-table';
import cuid from 'cuid';
import {
    ArticleRestitution,
    SectionRestitution,
    SectionRestitutionColumn,
    SectionRestitutionRow,
    Restitution,
} from '@axa-fr/react-toolkit-restitution';
import Action from "@axa-fr/react-toolkit-action";
import Tabs from "@axa-fr/react-toolkit-tabs/dist";
import '@axa-fr/react-toolkit-tabs/dist/tabs.scss';
import {computeNumberPages, filterPaging} from "../../shared/filtersUtils";
import {formatTimestampToString} from "../../date";
import {resilienceStatus} from "../../shared/Resilience";

const bytesToSize=(bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const downloadAsync = (fetch) => (datasetId, fileId, fileName) => async event => {
    event.preventDefault();
    const response = await fetch(`datasets/${datasetId}/files/${fileId}`, {
        method: 'GET'
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();         
};


const FileList = ({state, setState, fetch}) => {

    const deleteFile = async file => {
        setState({...state, status: resilienceStatus.POST});

        const response = await fetch(`datasets/${state.dataset.id}/files/${file.file.id}`, {
            method: 'DELETE'
        });
        
        if(response.status >= 500){
            setState({...state, status : resilienceStatus.ERROR });
            return;
        }

        const filesSend = [...state.files.filesSend];
        const index = filesSend.indexOf(file);
        if (index > -1) {
            filesSend.splice(index, 1);
        }
        setState({...state, files: {...state.files, filesSend}, status: resilienceStatus.SUCCESS});
    };

    const onChangePaging = ({numberItems, page}) => {
        setState({...state,
            files : {...state.files, paging: {
                itemByPages: numberItems,
                currentPages: page,
        }}});
    };
    const files = state.files;
    const paging = files.paging;
    const itemByPages = paging.itemByPages
    const numberPages = computeNumberPages(files.filesSend, itemByPages);
    const currentPages = paging.currentPages > numberPages ? numberPages :  paging.currentPages
    const itemFiltered= filterPaging(files.filesSend, itemByPages, currentPages);

    const reducer = (previousValue, currentValue) => previousValue + currentValue.file.size;
    const hasFiles = state.files.filesSend.length === 0;
    const fileSizeTotal =  hasFiles? 0 : state.files.filesSend.reduce(reducer, 0);
    const fileSizeAverage = hasFiles? 0 : fileSizeTotal / state.files.filesSend.length;

    return (
        <div className="edit-dataset__file-list-container">
            <Tabs classModifier="container" onChange={() => {}}>
                <Tabs.Tab title="Information générales">
                    <ArticleRestitution>
                        <SectionRestitution>
                            <SectionRestitutionRow title="">
                                <SectionRestitutionColumn>
                                    <Restitution label="Nom" value={state.dataset.name} />
                                    <Restitution label="Date de création" value={formatTimestampToString(state.dataset.createDate)} />
                                    <Restitution label="Type" value={state.dataset.type} />
                                </SectionRestitutionColumn>
                                <SectionRestitutionColumn>
                                    <Restitution label="Nombre de fichier" value={state.files.filesSend.length} />
                                    <Restitution label="Poids total des fichiers" value={bytesToSize(fileSizeTotal)} />
                                    <Restitution label="Poids moyen des fichiers" value={bytesToSize(fileSizeAverage)} />
                                </SectionRestitutionColumn>
                            </SectionRestitutionRow>
                        </SectionRestitution>
                    </ArticleRestitution>
                </Tabs.Tab>
                <Tabs.Tab title="Liste des fichiers">
                    <Table>
                        <Table.Header>
                            <Table.Tr>
                                <Table.Th>
                                    <span className="af-table__th-content">Nom</span>
                                </Table.Th>
                                <Table.Th>
                                    <span className="af-table__th-content ">Type</span>
                                </Table.Th>
                                <Table.Th>Size</Table.Th>
                                {state.dataset.isLock ? null :<Table.Th>Action</Table.Th>}
                            </Table.Tr>
                        </Table.Header>
                        <Table.Body>
                            {itemFiltered.map(file => (
                                    <Table.Tr key={cuid()}>
                                        <Table.Td>
                                         <a href={"#"+file.file.name} alt={file.file.name} onClick={downloadAsync(fetch)(state.dataset.id, file.file.id, file.file.name)}>{file.file.name}</a> 
                                        </Table.Td>
                                        <Table.Td>{file.file.type}</Table.Td>
                                        <Table.Td>{bytesToSize(file.file.size)}</Table.Td>
                                        {state.dataset.isLock ? null :<Table.Td> <Action
                                            id="deleteButton"
                                            icon="trash"
                                            title="Supprimer"
                                            onClick={() => deleteFile(file)}
                                        /></Table.Td>}
                                    </Table.Tr>
                                ))}
                        </Table.Body>
                    </Table>
                    <Paging
                        onChange={onChangePaging}
                        numberItems={itemByPages}
                        numberPages={numberPages}
                        currentPage={currentPages}
                        id="home_paging"
                    />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}

export default FileList;
