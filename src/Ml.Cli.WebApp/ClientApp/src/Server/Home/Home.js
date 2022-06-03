import React from "react";
import Title from "../../TitleBar";
import {Link} from 'react-router-dom';
import './Home.scss';
import withAuthentication, { Administateur, Annotateur, DataScientist } from "../withAuthentication";

export const Home = ({ user: { roles = [] } }) => (
    <div className="home">
        <Title title="Accueil" goButton={false}/>
        <div className="home__links-container">
            { roles.includes(Annotateur) && <Link className="home__link" to="/projects">
                <div className="home__link-container home__link-container--projects">Projets</div>
            </Link> }
            { roles.includes(DataScientist) && <Link className="home__link" to="/datasets">
                <div className="home__link-container home__link-container--datasets">Datasets</div>
            </Link>}
            { roles.includes(Administateur) && <Link className="home__link" to="/groups">
                <div className="home__link-container home__link-container--groups">Groupes</div>
            </Link>}
        </div>
        {(!roles.includes(Annotateur) && !roles.includes(DataScientist) && !roles.includes(Administateur)) && <p>Vous n'avez aucun rôle attribué à votre profile.</p>}
    </div>
);

export default withAuthentication()(Home);
