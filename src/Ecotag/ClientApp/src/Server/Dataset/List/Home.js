import React from 'react';
import {Link} from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import ItemsTable from "./ItemsTable";
import EmptyArrayManager from "../../../EmptyArrayManager";
import useProjectTranslation from "../../../useProjectTranslation";

const Home = ({items, numberTotalItems, filters, onChangePaging, onChangeFilter}) => {
    const {translate} = useProjectTranslation();
    return (
        <>
            <Title title={translate('dataset.title')} subtitle={translate('dataset.subtitle')}/>
            <div className="af-home container">
                <Link className="btn af-btn af-btn--quote" to="/datasets/new">
                    <span className="af-btn__text">{translate('dataset.new_dataset')}</span>
                </Link>
                <a className="af-home__access-token" target="_self" href="/access-token">{translate('dataset.access_token')}</a>
                <h1 className="af-title--content">{translate('dataset.active_datasets_counter')}{numberTotalItems}</h1>
                <div className="row row--datasets-filters">
                    <div className="col">
                        <div className="af-filter-inline">
                            <span className="af-filter-inline__title">
                                <span className="glyphicon glyphicon-filter"/>
                                <span className="af-filter-inline__title-text">{translate('dataset.filter_by')}</span>
                            </span>
                            <div className="af-filter-inline__field">
                                <label className="af-form__group-label" htmlFor="inputtext1">{translate('dataset.name')}</label>
                                <div className="af-form__text">
                                    <input className="af-form__input-text" id="inputtext1" name="inputtextname"
                                           onChange={onChangeFilter} type="text"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <EmptyArrayManager items={items} emptyArrayMessage={translate('dataset.empty_list')}>
                    <ItemsTable
                        items={items}
                        filters={filters}
                        onChangePaging={onChangePaging}
                        onChangeFilter={onChangeFilter}/>
                </EmptyArrayManager>
            </div>
        </>
    )
};

export default Home;
