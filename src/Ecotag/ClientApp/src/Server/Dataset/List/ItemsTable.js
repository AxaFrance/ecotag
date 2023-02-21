import React from "react";
import Table, {Paging} from '@axa-fr/react-toolkit-table';
import Loader from '@axa-fr/react-toolkit-loader';
import Action from "@axa-fr/react-toolkit-action";
import {useHistory} from "react-router-dom";
import {formatTimestampToString} from "../../date";
import {Locked} from "../Dataset.service";
import useProjectTranslation from "../../../translations/useProjectTranslation";

const getIconClassname = (locked) => {
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

const getIcon = (locked) => {
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

const ItemsTable = ({items, filters, loaderMode, onChangePaging}) => {

    const history = useHistory();
    const {translate} = useProjectTranslation();

    const editDatasetButton = id => {
        const path = `datasets/${id}`
        history.push(path);
    };

    const getTitle = (locked) => {
        switch (locked) {
            case Locked.Locked:
                return translate('dataset.list.actions_titles.locked');
            case Locked.LockedAndWorkInProgress:
                return translate('dataset.list.actions_titles.locked_and_work_in_progress');
            case Locked.Pending:
                return translate('dataset.list.actions_titles.pending');
            case Locked.None:
                return translate('dataset.list.actions_titles.none');
        }
    };

    return (
        <Loader mode={loaderMode}>
            <Table>
                <Table.Header>
                    <Table.Tr>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.lock')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.name')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.team')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.classification')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.nb_files')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.type')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('dataset.list.header.creation_date')}</span>
                        </Table.Th>
                        <Table.Th><span className="af-table__th-content">{translate('dataset.list.header.action')}</span></Table.Th>
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
                                            onClick={() => {
                                            }}/>
                                </Table.Td>
                                <Table.Td>{name}</Table.Td>
                                <Table.Td>{groupName}</Table.Td>
                                <Table.Td>{classification}</Table.Td>
                                <Table.Td>{numberFiles}</Table.Td>
                                <Table.Td>{type}</Table.Td>
                                <Table.Td>{formatTimestampToString(createDate)}</Table.Td>
                                <Table.Td>
                                    <Action id="id" icon="edit" title={translate('dataset.list.edit')} onClick={() => {
                                        editDatasetButton(id)
                                    }}/>
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
                displayLabel={translate('paging.display')}
                elementsLabel={translate('paging.elements')}
                previousLabel={translate('paging.previous')}
                nextLabel={translate('paging.next')}
            />
        </Loader>

    )
};

export default ItemsTable;