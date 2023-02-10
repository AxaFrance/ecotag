import React from 'react';
import Title from '../../TitleBar';
import './notfound.scss';
import {useTranslation} from 'react-i18next';

const NotFound = () => {
    const {t} = useTranslation();

    return(
        <>
            <Title title={t('not_found.title')}/>
            <div className="container af-container--notfound">
                <h1 className="af-notfound__title">
                    <div className="af-notfound__title-covernumber">
                        <span className="af-notfound__title-number">404</span>
                    </div>
                    <div className="af-notfound__title-covernot">
          <span className="af-notfound__title-not">
            {t('not_found.not')}
            <br/>
            {t('not_found.found')}
          </span>
                    </div>
                </h1>
                <p className="af-notfound__message">{t('not_found.message')}</p>
            </div>
        </>
    );
};

export default NotFound;
