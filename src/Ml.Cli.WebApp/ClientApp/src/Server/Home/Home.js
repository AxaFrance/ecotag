import React from "react";
import Title from "TitleBar";
import {Link} from 'react-router-dom';
import './Home.scss';

const Home = () => (
    <div className="home">
        <Title title="Accueil" goButton={false}/>
        <div className="home__links-container">
            <Link className="home__link" to="/projects">
                <div className="home__link-container home__link-container--projects">Projets</div>
            </Link>
            <Link className="home__link" to="/datasets">
                <div className="home__link-container home__link-container--datasets">Datasets</div>
            </Link>
            <Link className="home__link" to="/groups">
                <div className="home__link-container home__link-container--groups">Groupes</div>
            </Link>
        </div>
    </div>
);

export default Home;
