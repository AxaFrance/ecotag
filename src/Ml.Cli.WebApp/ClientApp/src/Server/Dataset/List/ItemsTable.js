﻿import React from "react";
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import Loader from '@axa-fr/react-toolkit-loader';
import HeaderColumnCell from "../../Project/List/ColumnHeader";
import Action from "@axa-fr/react-toolkit-action";
import {useHistory} from "react-router-dom";

const ItemsTable = ({items, filters, loaderMode, onChangePaging, onChangeSort}) => {

    const history = useHistory();
    
    const editDatasetButton = id => {
        const path = `datasets/${id}`
        history.push(path);
    };
    const formatDateToString = createDate => (createDate && createDate instanceof Date) ? `${createDate.getDay().toString().padStart(2, '0')}/${createDate.getMonth().toString().padStart(2, '0')}/${createDate.getFullYear()}` : ``;
    
    return(
        <>
            <div className="row row--datasets-filters">
                <div className="col">
                    <div className="af-filter-inline">
                            <span className="af-filter-inline__title">
                                <span className="glyphicon glyphicon-filter" />
                                <span className="af-filter-inline__title-text">Filtrer par</span>
                            </span>
                        <div className="af-filter-inline__field">
                            <label className="af-form__group-label" htmlFor="inputtext1">Nom du dataset</label>
                            <div className="af-form__text">
                                <input className="af-form__input-text" id="inputtext1" name="inputtextname" type="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Loader mode={loaderMode}>
                <Table>
                    <Table.Header>
                        <Table.Tr>
                            <Table.Th>
                                <span className="af-table__th-content">Vérouiller</span>
                            </Table.Th>
                            <HeaderColumnCell
                                onChangeSort={onChangeSort("name")}
                                headerColumnName={"Nom"}
                                filterColumnValue={filters.columns.name.value}/>
                            <HeaderColumnCell
                                onChangeSort={onChangeSort("classification")}
                                headerColumnName={"Classification"}
                                filterColumnValue={filters.columns.classification.value}/>
                            <HeaderColumnCell
                                onChangeSort={onChangeSort("numberFiles")}
                                headerColumnName={"Nombre de fichier"}
                                filterColumnValue={filters.columns.numberFiles.value}/>

                            <HeaderColumnCell
                                onChangeSort={onChangeSort("createDate")}
                                headerColumnName={"Date création"}
                                filterColumnValue={filters.columns.createDate.value}/>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Header>
                    <Table.Body>
                        {items.map(
                            ({id, name, type, classification, numberFiles, createDate, isLock}) => (
                                <Table.Tr key={id}>
                                    <Table.Td>
                                        <Action className={isLock ? 'btn af-btn--circle af-btn--danger' : 'btn af-btn--circle'}
                                                id="lock" icon={isLock ? "lock" : "unlock"}
                                                title={isLock ? "vérouillée" : "dévérouillée"}
                                                onClick={() => {}} />
                                    </Table.Td>
                                    <Table.Td>
                                        {name}
                                    </Table.Td>
                                    <Table.Td>{classification}</Table.Td>
                                    <Table.Td>{numberFiles} {type}</Table.Td>
                                    <Table.Td>{formatDateToString(createDate)}</Table.Td>
                                    <Table.Td>
                                        <Action id="id" icon="edit" title="Editer" onClick={() => {editDatasetButton(id)}} />
                                    </Table.Td>
                                </Table.Tr>
                            )
                        )}
                    </Table.Body>
                </Table>
                <Paging
                    onChange={onChangePaging}
                    numberItems={filters.paging.numberItemsByPage}
                    numberPages={filters.paging.numberPages}
                    currentPage={filters.paging.currentPage}
                    id="home_paging"
                />
            </Loader>
        </>
    )
};

export default ItemsTable;