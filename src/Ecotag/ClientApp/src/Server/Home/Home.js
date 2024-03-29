﻿import React from 'react';
import Title from "../../TitleBar";
import {Link} from 'react-router-dom';
import './Home.scss';
import withAuthentication, {Administateur, Annotateur, DataScientist} from '../withAuthentication';
import {OidcUserStatus} from '@axa-fr/react-oidc';
import useProjectTranslation from "../../useProjectTranslation";

export const Home = ({user: {roles = []}, userLoadingState}) => {
    const {translate} = useProjectTranslation();

    return (
        <div className="home">
            <Title title={translate('home.title')} goButton={false}/>
            <div className="home__links-container">
                {roles.includes(Annotateur) && <Link className="home__link" to="/projects">
                    <div className="home__link-container home__link-container--projects">{translate('home.projects')}</div>
                </Link>}
                {roles.includes(DataScientist) && <Link className="home__link" to="/datasets">
                    <div className="home__link-container home__link-container--datasets">{translate('home.datasets')}</div>
                </Link>}
                {roles.includes(Administateur) && <Link className="home__link" to="/teams">
                    <div className="home__link-container home__link-container--groups">{translate('home.groups')}</div>
                </Link>}
                {(!roles.includes(Annotateur) && !roles.includes(DataScientist) && !roles.includes(Administateur) && userLoadingState === OidcUserStatus.Loaded) &&
                    <p>{translate('home.errors.no_roles')}</p>}
            </div>
        </div>
    );
}

export default withAuthentication()(Home);
