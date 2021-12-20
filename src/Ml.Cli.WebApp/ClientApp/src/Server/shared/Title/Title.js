import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { NavBar, NavBarItem, Title } from '@axa-fr/react-toolkit-layout-header';
import './Title.scss';

const TitleBar = ({ backHome, positionInit = 0, subtitle = null, children, className }) => {
  const [isMenuVisible, setVisible] = useState(false);

  if (!backHome) {
    const handleClick = () => {
      const body = document.body;
      body.classList.toggle('af-menu-open');
      setVisible(!isMenuVisible);
    };

    return (
      <div>
        <NavBar isVisible={isMenuVisible} positionInit={positionInit} onClick={handleClick}>
          <NavBarItem
            actionElt={
              <Link className="af-nav__link" to="/">
                Projets
              </Link>
            }
          />
          <NavBarItem
            label="Forms"
            actionElt={
              <Link className="af-nav__link" to="/datasets">
                Datasets
              </Link>
            }
          />
          <NavBarItem
            label="Forms"
            actionElt={
              <Link className="af-nav__link" to="/groups">
                Groupes
              </Link>
            }
          />
        </NavBar>
        <Title title={children} subtitle={subtitle} toggleMenu={handleClick} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="container-fluid container af-title-bar__wrapper">
        {backHome && (
          <Link title="Retour à l'accueil" className="btn af-btn--circle" to={'/'}>
            <i className="glyphicon glyphicon-home" />
          </Link>
        )}
        <h1 className="af-title-bar__title">{children}</h1>
      </div>
    </div>
  );
};

TitleBar.defaultProps = {
  backHome: false,
  children: null,
  className: '',
};

TitleBar.propTypes = {
  backHome: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
};

export default TitleBar;
