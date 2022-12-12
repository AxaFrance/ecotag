import React from "react";
import Title from "../../TitleBar";
import {Link} from 'react-router-dom';
import './Home.scss';
import withAuthentication, {Administateur, Annotateur, DataScientist} from "../withAuthentication";
import {OidcUserStatus} from "@axa-fr/react-oidc";

export const Home = ({user: {roles = []}, userLoadingState}) => (
    <div className="home">
        <Title title="Accueil" goButton={false}/>
        <div className="home__links-container">
            {roles.includes(Annotateur) && <Link className="home__link" to="/projects">
                <div className="home__link-container home__link-container--projects">Projets</div>
            </Link>}
            {roles.includes(DataScientist) && <Link className="home__link" to="/datasets">
                <div className="home__link-container home__link-container--datasets">Datasets</div>
            </Link>}
            {roles.includes(Administateur) && <Link className="home__link" to="/teams">
                <div className="home__link-container home__link-container--groups">Equipes</div>
            </Link>}
            {(!roles.includes(Annotateur) && !roles.includes(DataScientist) && !roles.includes(Administateur) && userLoadingState === OidcUserStatus.Loaded) &&
                <p>Vous n'avez aucun rôle attribué à votre profile.</p>}
        </div>
    </div>
);

export default withAuthentication()(Home);
