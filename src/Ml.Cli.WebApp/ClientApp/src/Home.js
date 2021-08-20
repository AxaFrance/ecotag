import React from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import {Link} from 'react-router-dom';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import './Home.scss';
import Title from "@axa-fr/react-toolkit-layout-header/dist/Title/Title";

const Home = () => (
    <div className="home">
        <Header>
            <Name
                title="ML-CLI"
                subtitle="Made by AXA"
                img={logo}
                alt="Logo AXA"
            />
        </Header>
        <Title title="Liste des services"/>
        <div className="home__links-container">
            <Link className="home__link" to="/compare">
                <div className="home__link-container home__link-container--compare">Comparaison de services</div>
            </Link>
            <Link className="home__link" to="/annotate">
                <div className="home__link-container home__link-container--annotate">Annotation</div>
            </Link>
        </div>
    </div>
);

export default Home;
