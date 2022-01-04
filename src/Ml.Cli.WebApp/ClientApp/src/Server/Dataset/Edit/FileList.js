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

const FileList = ({state, setState}) => {

    const deleteFile = file => {
        let newFilesSend = state.filesSend.filter(item => item.id !== file.id);
        setState({...state, filesSend: newFilesSend, paging: {
                itemByPages: state.paging.itemByPages,
                currentPages: state.paging.currentPages,
                itemFiltered: filterPaging(newFilesSend, state.paging.itemByPages, state.paging.currentPages),
                numberPages: computeNumberPages(newFilesSend, state.paging.itemByPages)
            }});
    };

    const onChangePaging = ({numberItems, page}) => {
        console.log(numberItems, page)
        setState({...state,
            paging: {
                itemByPages: numberItems,
                currentPages: page,
                itemFiltered: filterPaging(state.filesSend, numberItems, page),
                numberPages: computeNumberPages(state.filesSend, numberItems)}
        })
    };

    return (
        <div className="edit-dataset__file-list-container">
            <Tabs classModifier="container" onChange={() => {}}>
                <Tabs.Tab title="Information générales">
                    <ArticleRestitution>
                        <SectionRestitution>
                            <SectionRestitutionRow title="">
                                <SectionRestitutionColumn>
                                    <Restitution label="nombre de fichier" value={state.filesSend.length} />
                                    <Restitution label="poids total des fichiers" value="valeur en dur" />
                                    <Restitution label="poids moyen des fichiers" value="valeur en dur" />
                                </SectionRestitutionColumn>
                                <SectionRestitutionColumn>
                                    <Restitution label="Date de création" value="valeur en dur" />
                                    <Restitution label="Dernière modifications" value="valeur en dur" />
                                </SectionRestitutionColumn>
                            </SectionRestitutionRow>
                        </SectionRestitution>
                    </ArticleRestitution>
                </Tabs.Tab>
                <Tabs.Tab title="liste des fichiers">
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
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Header>
                        <Table.Body>
                            {state.paging.itemFiltered.map(file => (
                                    <Table.Tr key={cuid()}>
                                        <Table.Td>
                                            {file.file.name}
                                        </Table.Td>
                                        <Table.Td>{file.file.type}</Table.Td>
                                        <Table.Td>{file.file.size}</Table.Td>
                                        <Table.Td>{state.isLock ? "" : <Action
                                            id="deleteButton"
                                            icon="trash"
                                            title="Editer"
                                            onClick={() => deleteFile(file)}
                                        />}</Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Body>
                    </Table>
                    <Paging
                        onChange={onChangePaging}
                        numberItems={state.paging.itemByPages}
                        numberPages={state.paging.numberPages}
                        currentPage={state.paging.currentPages}
                        id="home_paging"
                    />
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}

export default FileList;
