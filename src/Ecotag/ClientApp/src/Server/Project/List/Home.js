import React from 'react';
import {Link,} from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import '../../shared/Modal/modal.scss';
import EmptyArrayManager from '../../../EmptyArrayManager';
import ItemsTable from './ItemsTable';
import {DataScientist} from '../../withAuthentication';
import useProjectTranslation from '../../../useProjectTranslation';

const Home = ({items, numberTotalItems, filters, onChangePaging, onChangeFilter, onChangeSort, fetch, user}) => {
    const {translate} = useProjectTranslation();

    return (
        <>
            <Title title={translate('project.projects_list.title')} subtitle={translate('project.projects_list.subtitle')}/>
            <div className="af-home container">
                {user.roles.includes(DataScientist) && <Link className="btn af-btn af-btn--quote" to="/projects/new">
                    <span className="af-btn__text">{translate('project.projects_list.new')}</span>
                </Link>}
                <h1 className="af-title--content">{`${translate('project.projects_list.active_projects_counter')} (${numberTotalItems})`}</h1>
                <div className="row row--projects-filters">
                    <div className="col">
                        <div className="af-filter-inline">
                            <span className="af-filter-inline__title">
                                <span className="glyphicon glyphicon-filter"/>
                                <span className="af-filter-inline__title-text">{translate('project.projects_list.filter_by')}</span>
                            </span>
                            <div className="af-filter-inline__field">
                                <label className="af-form__group-label" htmlFor="inputTextFilterProjects">
                                    {translate('project.projects_list.project_name')}
                                </label>
                                <div className="af-form__text">
                                    <input
                                        className="af-form__input-text"
                                        id="inputTextFilterProjects"
                                        name="inputTextFilterProjects"
                                        onChange={event => onChangeFilter(event.target.value)}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <EmptyArrayManager items={items} emptyArrayMessage={translate('project.projects_list.no_elements')}>
                    <ItemsTable
                        items={items}
                        filters={filters}
                        onChangePaging={onChangePaging}
                        onChangeSort={onChangeSort}
                        fetch={fetch}
                    />
                </EmptyArrayManager>
            </div>
        </>
    );
};

export default Home;
