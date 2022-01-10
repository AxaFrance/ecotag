import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Title from '../../../TitleBar';
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import './Home.scss';
import Action from "@axa-fr/react-toolkit-action";
import HeaderColumnCell from "../../Project/List/ColumnHeader";

const Home = ({ items, filters, status, onChangePaging, onChangeSort }) => {
    const history = useHistory();
    const editDatasetButton = id => {
        const path = `datasets/${id}`
        history.push(path);
    };
    const formatDateToString = createDate => (createDate && createDate instanceof Date) ? `${createDate.getDay().toString().padStart(2, '0')}/${createDate.getMonth().toString().padStart(2, '0')}/${createDate.getFullYear()}` : ``;

    return (
        <>
            <Title title="Page datasets" subtitle="un dataset représente un essemble de données" />
            <div className="af-home container">
                <Link className="btn af-btn af-btn--quote" to="/datasets/new">
                    <span className="af-btn__text">Nouveau dataset</span>
                </Link>
                <h1 className="af-title--content">Vos datasets actifs : {items.length}</h1>
                <div className="row row--datasets-filters">
                    <div className="col">
                        <div className="af-filter-inline">
                            <span className="af-filter-inline__title">
                                <span className="glyphicon glyphicon-filter" />
                                <span className="af-filter-inline__title-text">Filtrer par</span>
                            </span>
                            <div className="af-filter-inline__field">
                                <label className="af-form__group-label" htmlFor="inputtext1">Nom du dataset</label>
                                <div className="af-form__text">
                                    <input className="af-form__input-text" id="inputtext1" name="inputtextname" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <Table>
                        <Table.Header>
                            <Table.Tr>
                                <Table.Th>
                                    <span className="af-table__th-content">Vérouiller</span>
                                </Table.Th>
                                <HeaderColumnCell
                                    onChangeSort={onChangeSort("name")}
                                    headerColumnName={"Nom"}
                                    filterColumnValue={filters.columns.name.value}/>
                                <HeaderColumnCell
                                    onChangeSort={onChangeSort("classification")}
                                    headerColumnName={"Classification"}
                                    filterColumnValue={filters.columns.classification.value}/>
                                <HeaderColumnCell
                                    onChangeSort={onChangeSort("numberFiles")}
                                    headerColumnName={"Nombre de fichier"}
                                    filterColumnValue={filters.columns.numberFiles.value}/>

                                <HeaderColumnCell
                                    onChangeSort={onChangeSort("createDate")}
                                    headerColumnName={"Date création"}
                                    filterColumnValue={filters.columns.createDate.value}/>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Header>
                        <Table.Body>
                            {items.map(
                                ({id, name, type, classification, numberFiles, createDate, isLock}) => (
                                    <Table.Tr key={id}>
                                        <Table.Td>
                                            <Action className={isLock ? 'btn af-btn--circle af-btn--danger' : 'btn af-btn--circle'}
                                                    id="lock" icon={isLock ? "lock" : "unlock"}
                                                    title={isLock ? "vérouillée" : "dévérouillée"}
                                                    onClick={() => {}} />
                                        </Table.Td>
                                        <Table.Td>
                                            {name}
                                        </Table.Td>
                                        <Table.Td>{classification}</Table.Td>
                                        <Table.Td>{numberFiles} {type}</Table.Td>
                                        <Table.Td>{formatDateToString(createDate)}</Table.Td>
                                        <Table.Td>
                                            <Action id="id" icon="edit" title="Editer" onClick={() => {editDatasetButton(id)}} />
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            )}
                        </Table.Body>
                    </Table>
                    <Paging
                        onChange={onChangePaging}
                        numberItems={filters.paging.numberItemsByPage}
                        numberPages={filters.paging.numberPages}
                        currentPage={filters.paging.currentPage}
                        id="home_paging"
                    />
            </div>
        </>
    )
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
    status: PropTypes.string,
};

export default Home;
