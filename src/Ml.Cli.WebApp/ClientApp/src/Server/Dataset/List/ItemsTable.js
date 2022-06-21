import React from "react";
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import Loader from '@axa-fr/react-toolkit-loader';
import HeaderColumnCell from "../../Project/List/ColumnHeader";
import Action from "@axa-fr/react-toolkit-action";
import {useHistory} from "react-router-dom";
import {formatTimestampToString} from "../../date";
import {Locked} from "../Dataset.service";

const getIconClassname = (locked) =>{
    switch (locked) {
        case Locked.Locked:
            return 'btn af-btn--circle af-btn--locked';
        case Locked.LockedAndWorkInProgress:
            return 'btn af-btn--circle af-btn--locked-and-work-in-progress';
        case Locked.Pending:
            return 'btn af-btn--circle af-btn--pending';
        case Locked.None:
            return 'btn af-btn--circle af-btn--none';
            
    }
}

const getIcon = (locked) =>{
    switch (locked) {
        case Locked.Locked:
        case Locked.LockedAndWorkInProgress:
            return 'lock';
        case Locked.Pending:
            return 'refresh';
        case Locked.None:
            return 'unlock';

    }
}

const getTitle = (locked) =>{
    switch (locked) {
        case Locked.Locked:
            return 'vérouillée';
        case Locked.LockedAndWorkInProgress:
            return 'vérouillée et travail en cours';
        case Locked.Pending:
            return 'en cours';
        case Locked.None:
            return 'dévérouillée';

    }
}

const ItemsTable = ({items, filters, loaderMode, onChangePaging}) => {

    const history = useHistory();
    
    const editDatasetButton = id => {
        const path = `datasets/${id}`
        history.push(path);
    };
    
    return(
            <Loader mode={loaderMode}>
                <Table>
                    <Table.Header>
                        <Table.Tr>
                            <Table.Th>
                                <span className="af-table__th-content">Verrouillage</span>
                            </Table.Th>
                            <Table.Th>
                                <span className="af-table__th-content">Nom</span>
                            </Table.Th>
                            <Table.Th>
                                <span className="af-table__th-content">Equipe</span>
                            </Table.Th>
                            <Table.Th>
                                <span className="af-table__th-content">Classification</span>
                            </Table.Th>
                            <Table.Th>
                                <span className="af-table__th-content">Nombre de fichiers</span>
                            </Table.Th>
                            <Table.Th>
                                <span className="af-table__th-content">Type</span>
                            </Table.Th>
                            <Table.Th>
                                <span className="af-table__th-content">Date création</span>
                            </Table.Th>
                            <Table.Th><span className="af-table__th-content">Action</span></Table.Th>
                        </Table.Tr>
                    </Table.Header>
                    <Table.Body>
                        {items.map(
                            ({id, name, type, groupName, classification, numberFiles, createDate, locked}) => (
                                <Table.Tr key={id}>
                                    <Table.Td>
                                        <Action className={getIconClassname(locked)}
                                                id="lock" icon={getIcon(locked)}
                                                title={getTitle(locked)}
                                                onClick={() => {}} />
                                    </Table.Td>
                                    <Table.Td>{name}</Table.Td>
                                    <Table.Td>{groupName}</Table.Td>
                                    <Table.Td>{classification}</Table.Td>
                                    <Table.Td>{numberFiles}</Table.Td>
                                    <Table.Td>{type}</Table.Td>
                                    <Table.Td>{formatTimestampToString(createDate)}</Table.Td>
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

    )
};

export default ItemsTable;