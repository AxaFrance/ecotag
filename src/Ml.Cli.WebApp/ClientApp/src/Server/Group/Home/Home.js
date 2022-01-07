import React from 'react';
import PropTypes from 'prop-types';
import Title from '../../../TitleBar';
import New from './New';

import './Home.scss';
import '../../shared/Modal/modal.scss';
import EmptyArrayManager from "../../../EmptyArrayManager";
import ItemsTable from "./ItemsTable";

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
        <EmptyArrayManager items={items} emptyArrayMessage="Aucun élément !">
          <ItemsTable
              items={items}
              filters={filters}
              loaderMode={loaderMode}
              onChangePaging={onChangePaging}
              onDeleteGroup={onDeleteGroup}
              onUpdateUser={onUpdateUser}
          />
        </EmptyArrayManager>
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
