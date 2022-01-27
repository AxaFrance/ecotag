import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import ItemsTable from "./ItemsTable";
import EmptyArrayManager from "../../../EmptyArrayManager";

const Home = ({ items, filters, onChangePaging }) => {

    return (
        <>
            <Title title="Page datasets" subtitle="un dataset représente un essemble de données" />
            <div className="af-home container">
                <Link className="btn af-btn af-btn--quote" to="/datasets/new">
                    <span className="af-btn__text">Nouveau dataset</span>
                </Link>
                <h1 className="af-title--content">Vos datasets actifs : {items.length}</h1>
                <EmptyArrayManager items={items} emptyArrayMessage="Aucun élément">
                    <ItemsTable 
                        items={items}
                        filters={filters}
                        onChangePaging={onChangePaging} />
                </EmptyArrayManager>
            </div>
        </>
    )
};

export default Home;
