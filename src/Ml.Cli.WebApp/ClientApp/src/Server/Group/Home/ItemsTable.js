import React, {useState} from "react";
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import Action from '@axa-fr/react-toolkit-action';
import BooleanModal from '@axa-fr/react-toolkit-modal-boolean';
import Edit from "./Edit";

const DeleteGroupModal = ({ idGroup, isDeleteModalVisible, setDeleteModalVisible, onDeleteGroup }) => {
    return (
        <BooleanModal
            className={'af-modal'}
            isOpen={isDeleteModalVisible}
            title={'Confirmer la suppression de groupe ?'}
            id={'deleteModalId'}
            onCancel={() => setDeleteModalVisible(false)}
            onOutsideTap={() => setDeleteModalVisible(false)}
            onSubmit={() => {
                onDeleteGroup(idGroup);
                setDeleteModalVisible(false);
                return false;
            }}
            submitTitle={'Supprimer'}
            cancelTitle={'Annuler'}>
            <p>Confirmez-vous la suppression de ce groupe ?</p>
        </BooleanModal>
    );
};

const UserRow = ({ id, name, users, eligibleUsers, onUpdateUser, onDeleteGroup }) => {
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isManageUsersModalVisible, setManageUsersModalVisible] = useState(false);
    return (
        <Table.Tr key={id}>
            <Table.Td>{name}</Table.Td>
            <Table.Td>{users.map(user => user.email).join(', ')}</Table.Td>
            <Table.Td>
                <Action id="editActionId" icon="pencil" title="Modifier" onClick={() => setManageUsersModalVisible(true)} />
                <Edit
                    idGroup={id}
                    users={users}
                    eligibleUsers={eligibleUsers}
                    onUpdateUser={onUpdateUser}
                    isManageUsersModalVisible={isManageUsersModalVisible}
                    setManageUsersModalVisible={setManageUsersModalVisible}
                />
                <Action id="removeActionId" icon="remove" title="Supprimer" onClick={() => setDeleteModalVisible(true)} />
                <DeleteGroupModal
                    idGroup={id}
                    isDeleteModalVisible={isDeleteModalVisible}
                    setDeleteModalVisible={setDeleteModalVisible}
                    onDeleteGroup={onDeleteGroup}
                />
            </Table.Td>
        </Table.Tr>
    );
};

const ItemsTable = ({items, filters, onChangePaging, onDeleteGroup, onUpdateUser}) => {
    console.log(items);
    return(
        <>
            <Table>
                <Table.Header>
                    <Table.Tr>
                        <Table.Th>
                            <span className="af-table__th-content">Nom du groupe</span>
                        </Table.Th>
                        <Table.Th>Utilisateurs</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Header>
                <Table.Body>
                    {items.map(({ id, name, users = [], eligibleUsers = [] }) => (
                        <UserRow
                            key={id}
                            id={id}
                            name={name}
                            users={users}
                            eligibleUsers={eligibleUsers}
                            onUpdateUser={onUpdateUser}
                            onDeleteGroup={onDeleteGroup}
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
            />
        </>
    )
};

export default ItemsTable;