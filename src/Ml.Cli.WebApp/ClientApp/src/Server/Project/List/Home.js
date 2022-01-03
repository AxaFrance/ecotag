import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Title from '../../../TitleBar';
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import Loader from '@axa-fr/react-toolkit-loader';
import Action from '@axa-fr/react-toolkit-action';
import BooleanModal from '@axa-fr/react-toolkit-modal-boolean';
import './Home.scss';
import '../../shared/Modal/modal.scss';
import HeaderColumnCell from './ColumnHeader';

const DeleteProjectModal = ({ idProject, isDeleteModalVisible, setDeleteModalVisible, onDeleteProject }) => (
  <BooleanModal
    className={'af-modal'}
    classModifier={''}
    isOpen={isDeleteModalVisible}
    title={'Confirmer la suppression du projet ?'}
    id={'deleteModalId'}
    onCancel={() => setDeleteModalVisible(false)}
    onOutsideTap={() => setDeleteModalVisible(false)}
    onSubmit={() => {
      onDeleteProject(idProject);
      setDeleteModalVisible(false);
      return false;
    }}
    submitTitle={'Supprimer'}
    cancelTitle={'Annuler'}>
    <p>Confirmez-vous la suppression de ce projet ?</p>
  </BooleanModal>
);

const ProjectRow = ({ id, name, classification, createDate, typeAnnotation, numberTagToDo, onDeleteProject }) => {
  const history = useHistory();
  const projectPageButton = id => {
    const path = `/projects/${id}`;
    history.push(path);
  };
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  return (
    <Table.Tr key={id}>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{classification}</Table.Td>
      <Table.Td>{createDate}</Table.Td>
      <Table.Td>{typeAnnotation}</Table.Td>
      <Table.Td>{numberTagToDo}</Table.Td>
      <Table.Td>
        <Action id="id" icon="zoom-in" title="Editer" onClick={() => projectPageButton(id)} />
        <Action id="removeActionId" icon="remove" title="Supprimer" onClick={() => setDeleteModalVisible(true)} />
        <DeleteProjectModal
          idProject={id}
          isDeleteModalVisible={isDeleteModalVisible}
          setDeleteModalVisible={setDeleteModalVisible}
          onDeleteProject={onDeleteProject}
        />
      </Table.Td>
    </Table.Tr>
  );
};

const formatDateToString = createDate =>
  createDate && createDate instanceof Date
    ? `${createDate.getDay().toString().padStart(2, '0')}/${createDate
        .getMonth()
        .toString()
        .padStart(2, '0')}/${createDate.getFullYear()}`
    : '';

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
        <Loader mode={loaderMode}>
          <Table>
            <Table.Header>
              <Table.Tr>
                <HeaderColumnCell
                  onChangeSort={onChangeSort('name')}
                  headerColumnName={'Nom'}
                  filterColumnValue={filters.columns.name.value}
                />
                <HeaderColumnCell
                  onChangeSort={onChangeSort('classification')}
                  headerColumnName={'Classification'}
                  filterColumnValue={filters.columns.classification.value}
                />
                <HeaderColumnCell
                  onChangeSort={onChangeSort('createDate')}
                  headerColumnName={'Date création'}
                  filterColumnValue={filters.columns.createDate.value}
                />
                <HeaderColumnCell
                  onChangeSort={onChangeSort('typeAnnotation')}
                  headerColumnName={"Type d'annotation"}
                  filterColumnValue={filters.columns.typeAnnotation.value}
                />
                <HeaderColumnCell
                  onChangeSort={onChangeSort('numberTagToDo')}
                  headerColumnName={'Tags restants'}
                  filterColumnValue={filters.columns.numberTagToDo.value}
                />
                <Table.Th classModifier="sortable">
                  <span className="af-table__th-content af-btn__text">Action</span>
                </Table.Th>
              </Table.Tr>
            </Table.Header>
            <Table.Body>
              {items.map(({ id, name, classification, createDate, numberTagToDo, typeAnnotation }) => (
                <ProjectRow
                  key={id}
                  id={id}
                  name={name}
                  classification={classification}
                  createDate={formatDateToString(createDate)}
                  numberTagToDo={numberTagToDo}
                  typeAnnotation={typeAnnotation}
                  onDeleteProject={onDeleteProject}
                />
              ))}
            </Table.Body>
          </Table>
          <Paging
            onChange={onChangePaging}
            numberItems={filters.paging.numberItemsByPage}
            numberPages={filters.paging.numberPages}
            currentPage={filters.paging.currentPage}
            id="home_paging"
          />
        </Loader>
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
