import React  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Title from '../../../TitleBar';
import './Home.scss';
import '../../shared/Modal/modal.scss';
import EmptyArrayManager from "../../../EmptyArrayManager";
import ItemsTable from "./ItemsTable";

const Home = ({ items, filters, loaderMode, onChangePaging, onChangeFilter, onChangeSort, onDeleteProject }) => {
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
                <label className="af-form__group-label" htmlFor="inputtext1">
                  Nom du projet
                </label>
                <div className="af-form__text">
                  <input
                    className="af-form__input-text"
                    id="inputtext1"
                    name="inputtextname"
                    onChange={event => onChangeFilter(event.target.value)}
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <EmptyArrayManager onEmptyArray="Aucun élément !">
            <ItemsTable
                items={items}
                filters={filters}
                loaderMode={loaderMode}
                onChangePaging={onChangePaging}
                onChangeSort={onChangeSort}
                onDeleteProject={onDeleteProject}
            />
        </EmptyArrayManager>
      </div>
    </>
  );
};

Home.defaultProps = {
  items: [],
  loaderMode: '',
};
Home.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      type: PropTypes.string,
      agent: PropTypes.string,
      birthdate: PropTypes.string,
      begin: PropTypes.string,
    })
  ),
  loaderMode: PropTypes.string,
};

export default Home;
