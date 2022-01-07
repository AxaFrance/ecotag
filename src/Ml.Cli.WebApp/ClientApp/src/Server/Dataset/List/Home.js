import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import ItemsTable from "./ItemsTable";
import EmptyArrayManager from "../../../EmptyArrayManager";

const Home = ({ items, filters, loaderMode, onChangePaging, onChangeSort }) => {

    return (
        <>
            <Title title="Page datasets" subtitle="un dataset représente un essemble de données" />
            <div className="af-home container">
                <Link className="btn af-btn af-btn--quote" to="/datasets/new">
                    <span className="af-btn__text">Nouveau dataset</span>
                </Link>
                <h1 className="af-title--content">Vos datasets actifs : {items.length}</h1>
                <EmptyArrayManager items={items} emptyArrayMessage="Aucun élément !">
                    <ItemsTable 
                        items={items}
                        filters={filters}
                        loaderMode={loaderMode}
                        onChangePaging={onChangePaging}
                        onChangeSort={onChangeSort}/>
                </EmptyArrayManager>
            </div>
        </>
    )
};

Home.defaultProps = {
    items: [],
    loaderMode: '',
};
Home.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            firstname: PropTypes.string,
            lastname: PropTypes.string,
            type: PropTypes.string,
            agent: PropTypes.string,
            birthdate: PropTypes.string,
            begin: PropTypes.string,
        })
    ),
    loaderMode: PropTypes.string,
};

export default Home;
