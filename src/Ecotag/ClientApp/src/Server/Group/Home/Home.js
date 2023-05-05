import React from 'react';
import Title from '../../../TitleBar';
import New from './New';

import './Home.scss';
import '../../shared/Modal/modal.scss';
import EmptyArrayManager from "../../../EmptyArrayManager";
import ItemsTable from "./ItemsTable";
import useProjectTranslation from "../../../useProjectTranslation";

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
    const {translate} = useProjectTranslation();

    return (
        <>
            <Title subtitle={translate('group.subtitle')} title={translate('group.title')}/>
            <div className="af-home container">
                <h1 className="af-title--content">{translate('group.creation_title')}</h1>
                <New
                    disabled={isSubmitable}
                    fields={fields}
                    hasSubmit={hasSubmit}
                    onChangeCreateGroup={onChangeCreateGroup}
                    onSubmitCreateGroup={onSubmitCreateGroup}
                />
                <h1 className="af-title--content">
                    {`${translate('group.count_teams.first_part')}${numberItemsTotal}${translate('group.count_teams.second_part')}`}
                </h1>
                <EmptyArrayManager items={items} emptyArrayMessage={translate('group.empty_list')}>
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
