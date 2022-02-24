import React from 'react';
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
                onChangePaging,
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
          <EmptyArrayManager items={items} emptyArrayMessage="Aucun élément">
            <ItemsTable
                items={items}
                filters={filters}
                onChangePaging={onChangePaging}
                onUpdateUser={onUpdateUser}
            />
          </EmptyArrayManager>
        </div>
      </>
  );
};

export default Home;
