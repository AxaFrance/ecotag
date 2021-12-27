import React from 'react';
import Title from 'TitleBar';
import './notfound.scss';

const NotFound = () => (
  <>
    <Title title="404 Page Not Found" />
    <div className="container af-container--notfound">
      <h1 className="af-notfound__title">
        <div className="af-notfound__title-covernumber">
          <span className="af-notfound__title-number">404</span>
        </div>
        <div className="af-notfound__title-covernot">
          <span className="af-notfound__title-not">
            not
            <br />
            found
          </span>
        </div>
      </h1>
      <p className="af-notfound__message">The page you are looking for is not here!</p>
    </div>
  </>
);

export default NotFound;
