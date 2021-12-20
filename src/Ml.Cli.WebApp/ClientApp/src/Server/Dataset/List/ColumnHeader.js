import React from 'react';
import Table from '@axa-fr/react-toolkit-table';
import Button from "@axa-fr/react-toolkit-button";
import './Home.scss';
import '../../shared/Modal/modal.scss';

const HeaderColumnCell = ({ onChangeSort, headerColumnName, filterColumnValue }) => {
    return (
        <Table.Th classModifier="sortable">
        <span className="af-table__th-content">
          <Button className="af-btn" classModifier="table-sorting" onClick={() => onChangeSort()}>
            <span className="af-btn__text">{headerColumnName}</span>
            <i className={"glyphicon " + (filterColumnValue === null ? "glyphicon-sorting" : `glyphicon-sorting-${filterColumnValue}`) } />
          </Button>
        </span>
        </Table.Th>
    );
};

export default HeaderColumnCell;
