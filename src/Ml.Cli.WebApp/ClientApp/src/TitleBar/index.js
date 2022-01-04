import React from 'react';
import {Link} from 'react-router-dom';
import './TitleBar.scss';

import {Title} from "@axa-fr/react-toolkit-layout-header";

const defaultClassName = 'af-title-bar';
const TitleBar = ({title, goTo = "/", goTitle="Home page", classModifier="", subtitle=null, goButton=true}) => {
    
    if(!goButton){
        return  <Title title="Accueil"/>
    }
    
    const divClassName = "af-title-bar af-title-bar--backhome" + (classModifier ? " " + classModifier : "");
    
    return (
        <div className={divClassName}>
            <div className="container-fluid container af-title-bar__wrapper">
                    <Link title={goTitle} className="btn af-btn--circle" to={goTo}>
                        <i className={goTo === "/" ? "glyphicon glyphicon-home" : "glyphicon glyphicon-arrowthin-left"}/>
                    </Link>
                <h1 className="af-title-bar__title">{title}</h1>
                {subtitle && (<small className={`${defaultClassName}__subtitle`}>
                    {subtitle}
                </small> )}
            </div>
        </div>
    );
};

export default TitleBar;
