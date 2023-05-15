import React from 'react';
import Title from '../../TitleBar';
import './notfound.scss';
import useProjectTranslation from "../../useProjectTranslation";

const NotFound = () => {
    const {translate} = useProjectTranslation();

    return(
        <>
            <Title title={translate('not_found.title')}/>
            <div className="container af-container--notfound">
                <h1 className="af-notfound__title">
                    <div className="af-notfound__title-covernumber">
                        <span className="af-notfound__title-number">404</span>
                    </div>
                    <div className="af-notfound__title-covernot">
          <span className="af-notfound__title-not">
            {translate('not_found.not')}
            <br/>
            {translate('not_found.found')}
          </span>
                    </div>
                </h1>
                <p className="af-notfound__message">{translate('not_found.message')}</p>
            </div>
        </>
    );
};

export default NotFound;
