import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import ItemsTable from "./ItemsTable";
import EmptyArrayManager from "../../../EmptyArrayManager";

const Home = ({ items, filters, onChangePaging, onChangeFilter }) => {
    return (
        <>
            <Title title="Page datasets" subtitle="un dataset représente un essemble de données" />
            <div className="af-home container">
                <Link className="btn af-btn af-btn--quote" to="/datasets/new">
                    <span className="af-btn__text">Nouveau dataset</span>
                </Link>
                <h1 className="af-title--content">Vos datasets actifs : {items.length}</h1>
                <div className="row row--datasets-filters">
                    <div className="col">
                        <div className="af-filter-inline">
                            <span className="af-filter-inline__title">
                                <span className="glyphicon glyphicon-filter" />
                                <span className="af-filter-inline__title-text">Filtrer par</span>
                            </span>
                            <div className="af-filter-inline__field">
                                <label className="af-form__group-label" htmlFor="inputtext1">Nom du dataset</label>
                                <div className="af-form__text">
                                    <input className="af-form__input-text" id="inputtext1" name="inputtextname" onChange={onChangeFilter} type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <EmptyArrayManager items={items} emptyArrayMessage="Aucun élément">
                    <ItemsTable 
                        items={items}
                        filters={filters}
                        onChangePaging={onChangePaging}
                        onChangeFilter={onChangeFilter} />
                </EmptyArrayManager>
            </div>
        </>
    )
};

export default Home;
