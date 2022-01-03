import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Title from '../../../TitleBar';
import New from './New';
import Edit from './Edit';
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import Loader from '@axa-fr/react-toolkit-loader';
import Action from '@axa-fr/react-toolkit-action';
import BooleanModal from '@axa-fr/react-toolkit-modal-boolean';

import './Home.scss';
import '../../shared/Modal/modal.scss';

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

const Home = ({
  items,
  numberItemsTotal,
  filters,
  loaderMode,
  onChangePaging,
  onDeleteGroup,
  fields,
  isSubmitable,
  hasSubmit,
  onChangeCreateGroup,
  onSubmitCreateGroup,
  onUpdateUser,
}) => {
  return (
    <>
      <Title subtitle="Gestion des groupes d'annotateurs" title="Page Groupes"  />
      <div className="af-home container">
        <h1 className="af-title--content">Création de groupe</h1>
        <New
          disabled={isSubmitable}
          fields={fields}
          hasSubmit={hasSubmit}
          onChangeCreateGroup={onChangeCreateGroup}
          onSubmitCreateGroup={onSubmitCreateGroup}
        />
        <h1 className="af-title--content">
          {`Affichage des groupes - il y a actuellement (${numberItemsTotal}) groupes`}
        </h1>
        <Loader mode={loaderMode}>
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
        </Loader>
      </div>
    </>
  );
};

Home.defaultProps = {
  items: [],
  loaderMode: '',
};
Home.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      users: PropTypes.array,
    })
  ),
  fields: PropTypes.object,
  loaderMode: PropTypes.string,
  isSubmitable: PropTypes.bool,
  hasSubmit: PropTypes.bool,
  onChangeCreateGroup: PropTypes.func,
  onSubmitCreateGroup: PropTypes.func,
  onChangePaging: PropTypes.func,
  onDeleteGroup: PropTypes.func,
  onUpdateUser: PropTypes.func,
};

export default Home;
