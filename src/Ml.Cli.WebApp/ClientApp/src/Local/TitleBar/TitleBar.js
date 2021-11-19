import React from 'react';
import {Link} from 'react-router-dom';
import './TitleBar.scss';

const TitleBar = ({title, goTo = "/", goTitle="Home page", classModifier=""}) => {
    
    const divClassName = "af-title-bar af-title-bar--backhome " + classModifier;
    
    return (
        <div className={divClassName}>
            <div className="container-fluid container af-title-bar__wrapper">
                    <Link title={goTitle} className="btn af-btn--circle" to={goTo}>
                        <i className={goTo === "/" ? "glyphicon glyphicon-home" : "glyphicon glyphicon-arrowthin-left"}/>
                    </Link>
                <h1 className="af-title-bar__title">{title}</h1>
            </div>
        </div>
    );
};

export default TitleBar;
