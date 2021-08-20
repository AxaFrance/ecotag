import React  from 'react';
import { Link } from 'react-router-dom';
import './TitleBar.scss';

const TitleBar = ({title}) => {
    return (
        <div className="af-title-bar af-title-bar--backhome">
            <div className="container-fluid container af-title-bar__wrapper">
                <Link title="Retour à l'accueil" className="btn af-btn--circle" to="/">
                    <i className="glyphicon glyphicon-home" />
                </Link>
                <h1 className="af-title-bar__title">{title}</h1>
            </div>
        </div>
    );
};

export default TitleBar;
