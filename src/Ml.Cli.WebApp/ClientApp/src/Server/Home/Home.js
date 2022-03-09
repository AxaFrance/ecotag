import React from "react";
import Title from "../../TitleBar";
import {Link} from 'react-router-dom';
import './Home.scss';
import withAuthentication, { Administateur, Annotateur, DataScientist } from "../withAuthentication";

export const Home = ({ user: { roles = [] } }) => (
    <div className="home">
        <Title title="Accueil" goButton={false}/>
        <div className="home__links-container">
            { roles.includes(Annotateur) ? <Link className="home__link" to="/projects">
                <div className="home__link-container home__link-container--projects">Projets</div>
            </Link> : null}
            { roles.includes(DataScientist) ? <Link className="home__link" to="/datasets">
                <div className="home__link-container home__link-container--datasets">Datasets</div>
            </Link>: null}
            { roles.includes(Administateur) ? <Link className="home__link" to="/groups">
                <div className="home__link-container home__link-container--groups">Groupes</div>
            </Link> : null}
        </div>
    </div>
);

export default withAuthentication()(Home);
