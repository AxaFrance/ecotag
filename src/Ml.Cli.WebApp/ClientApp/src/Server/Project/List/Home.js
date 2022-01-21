import React from 'react';
import { Link,  } from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import '../../shared/Modal/modal.scss';
import EmptyArrayManager from "../../../EmptyArrayManager";
import ItemsTable from "./ItemsTable";

const Home = ({ items, filters, onChangePaging, onChangeFilter, onChangeSort, onDeleteProject }) => {
  const numberItemsTotal = items && items.length ? items.length : 0;
  return (
      <>
        <Title title="Page projets" subtitle="tagger un ensemble de donnée" />
        <div className="af-home container">
          <Link className="btn af-btn af-btn--quote" to="/projects/new">
            <span className="af-btn__text">Nouveau projet</span>
          </Link>
          <h1 className="af-title--content">{`Vos projets en cours (${numberItemsTotal})`}</h1>
          <div className="row row--projects-filters">
            <div className="col">
              <div className="af-filter-inline">
              <span className="af-filter-inline__title">
                <span className="glyphicon glyphicon-filter" />
                <span className="af-filter-inline__title-text">Filtrer par</span>
              </span>
                <div className="af-filter-inline__field">
                  <label className="af-form__group-label" htmlFor="inputTextFilterProjects">
                    Nom du projet
                  </label>
                  <div className="af-form__text">
                    <input
                        className="af-form__input-text"
                        id="inputTextFilterProjects"
                        name="inputTextFilterProjects"
                        onChange={event => onChangeFilter(event.target.value)}
                        type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EmptyArrayManager items={items} emptyArrayMessage="Aucun élément">
            <ItemsTable
                items={items}
                filters={filters}
                onChangePaging={onChangePaging}
                onChangeSort={onChangeSort}
                onDeleteProject={onDeleteProject}
            />
          </EmptyArrayManager>
        </div>
      </>
  );
};

export default Home;
