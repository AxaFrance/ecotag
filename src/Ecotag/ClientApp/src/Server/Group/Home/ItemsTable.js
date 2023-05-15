import React, {useState} from "react";
import Table, {Paging} from '@axa-fr/react-toolkit-table';
import Action from '@axa-fr/react-toolkit-action';
import Edit from "./Edit";
import './ItemsTable.scss';
import useProjectTranslation from "../../../useProjectTranslation";

const computeUsersList = users => {
    if (users.length === 0) {
        return "-";
    }
    return users.map(user => user.email).join(', ');
};

const UserRow = ({id, name, users, eligibleUsers, onUpdateUser}) => {
    const [isManageUsersModalVisible, setManageUsersModalVisible] = useState(false);
    const {translate} = useProjectTranslation();
    return (
        <Table.Tr key={id}>
            <Table.Td>{name}</Table.Td>
            <Table.Td>{computeUsersList(users)}</Table.Td>
            <Table.Td class="af-table__cell af-table__small">
                <Action id="editActionId" icon="pencil" title={translate('group.list.edit')}
                        onClick={() => setManageUsersModalVisible(true)}/>
                <Edit
                    idGroup={id}
                    users={users}
                    eligibleUsers={eligibleUsers}
                    onUpdateUser={onUpdateUser}
                    isManageUsersModalVisible={isManageUsersModalVisible}
                    setManageUsersModalVisible={setManageUsersModalVisible}
                />
            </Table.Td>
        </Table.Tr>
    );
};

const ItemsTable = ({items, filters, onChangePaging, onUpdateUser}) => {
    const {translate} = useProjectTranslation();

    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Tr>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('group.list.header.name')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('group.list.header.users')}</span>
                        </Table.Th>
                        <Table.Th>
                            <span className="af-table__th-content">{translate('group.list.header.actions')}</span>
                        </Table.Th>
                    </Table.Tr>
                </Table.Header>
                <Table.Body>
                    {items.map(({id, name, users = [], eligibleUsers = []}) => (
                        <UserRow
                            key={id}
                            id={id}
                            name={name}
                            users={users}
                            eligibleUsers={eligibleUsers}
                            onUpdateUser={onUpdateUser}
                        />
                    ))}
                </Table.Body>
            </Table>
            <Paging
                onChange={onChangePaging}
                numberItems={filters.paging.numberItemsByPage}
                numberPages={filters.paging.numberPages}
                currentPage={filters.paging.currentPage}
                id="home_paging"
                displayLabel={translate('group.paging.display')}
                elementsLabel={translate('group.paging.elements')}
                previousLabel={translate('group.paging.previous')}
                nextLabel={translate('group.paging.next')}
            />
        </>
    )
};

export default ItemsTable;