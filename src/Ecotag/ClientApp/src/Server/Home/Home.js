import React from "react";
import Title from "../../TitleBar";
import {Link} from 'react-router-dom';
import './Home.scss';
import withAuthentication, {Administateur, Annotateur, DataScientist} from "../withAuthentication";
import {OidcUserStatus} from "@axa-fr/react-oidc";
import {useTranslation} from "react-i18next";

export const Home = ({user: {roles = []}, userLoadingState}) => {
    const {t} = useTranslation();

    return (
        <div className="home">
            <Title title={t('home.title')} goButton={false}/>
            <div className="home__links-container">
                {roles.includes(Annotateur) && <Link className="home__link" to="/projects">
                    <div className="home__link-container home__link-container--projects">{t('home.projects')}</div>
                </Link>}
                {roles.includes(DataScientist) && <Link className="home__link" to="/datasets">
                    <div className="home__link-container home__link-container--datasets">{t('home.datasets')}</div>
                </Link>}
                {roles.includes(Administateur) && <Link className="home__link" to="/teams">
                    <div className="home__link-container home__link-container--groups">{t('home.groups')}</div>
                </Link>}
                {(!roles.includes(Annotateur) && !roles.includes(DataScientist) && !roles.includes(Administateur) && userLoadingState === OidcUserStatus.Loaded) &&
                    <p>{t('home.errors.no_roles')}</p>}
            </div>
        </div>
    );
}

export default withAuthentication()(Home);
