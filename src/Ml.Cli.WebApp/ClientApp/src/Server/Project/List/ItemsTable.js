import HeaderColumnCell from "./ColumnHeader";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Table, { Paging } from '@axa-fr/react-toolkit-table';
import Action from '@axa-fr/react-toolkit-action';
import {formatTimestampToString} from "../../date";
import {fetchAnnotationsStatus} from "../Project.service";
import {resilienceStatus} from "../../shared/Resilience";


const NumberTagToDo = ({state}) =>{
    const {ERROR, SUCCESS, LOADING} = resilienceStatus;
    const annotationsStatus = state.annotationsStatus;
    return <>{{
        [LOADING]: <span>Chargement...</span>,
        [ERROR]: (
            <span>Erreur...</span>
        ),
        [SUCCESS]: <>
            <progress value={annotationsStatus.percentageNumberAnnotationsDone} max="100"/>
            <span>{annotationsStatus.numberAnnotationsDone+ " / " + annotationsStatus.numberAnnotationsToDo}</span>
        </>
    }[state.status]
    }
    </>
    
}


const ProjectRow = ({ id, name, groupName, createDate, annotationType, fetch }) => {
    const history = useHistory();
    const projectPageButton = id => {
        const path = `/projects/${id}`;
        history.push(path);
    };
    const [state, setState] = useState({
        annotationsStatus: {
                isAnnotationClosed: true,
                numberAnnotationsByUsers: [],
                numberAnnotationsDone: 0,
                numberAnnotationsToDo:0,
                percentageNumberAnnotationsDone:0
        },
        status: resilienceStatus.LOADING
    })
    useEffect(async () => {

        const annotationsStatusResponse = await fetchAnnotationsStatus(fetch)(id);
        if (annotationsStatusResponse.status >= 500) {
            const data = {
                ...state,
                status: resilienceStatus.ERROR
            };
            setState(data);
        } else {
            const annotationsStatus = await annotationsStatusResponse.json();
            const data = {annotationsStatus, status: resilienceStatus.SUCCESS};
            setState(data);
        }

    }, []);
    
    return (
        <Table.Tr key={id}>
            <Table.Td>{name}</Table.Td>
            <Table.Td>{groupName}</Table.Td>
            <Table.Td>{createDate}</Table.Td>
            <Table.Td>{annotationType}</Table.Td>
            <Table.Td><NumberTagToDo state={state}/></Table.Td>
            <Table.Td>
                <Action id="id" icon="zoom-in" title="Editer" onClick={() => projectPageButton(id)} />
            </Table.Td>
        </Table.Tr>
    );
};

const ItemsTable = ({items, filters, onChangePaging, onChangeSort, fetch}) => {
    return(
        <>
            <Table>
                <Table.Header>
                    <Table.Tr>
                        <HeaderColumnCell
                            onChangeSort={onChangeSort('name')}
                            headerColumnName={'Nom'}
                            filterColumnValue={filters.columns.name.value}
                        />
                        <HeaderColumnCell
                            onChangeSort={onChangeSort('groupName')}
                            headerColumnName={'Groupe'}
                            filterColumnValue={filters.columns.groupName.value}
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
                            filterColumnValue={filters.columns.numberCrossAnnotation.value}
                        />
                        <Table.Th classModifier="sortable">
                            <span className="af-table__th-content af-btn__text">Action</span>
                        </Table.Th>
                    </Table.Tr>
                </Table.Header>
                <Table.Body>
                    {items.map(({ id, name, groupName, createDate, numberTagToDo, annotationType }) => (
                        <ProjectRow
                            key={id}
                            id={id}
                            name={name}
                            groupName={groupName}
                            createDate={formatTimestampToString(createDate)}
                            numberTagToDo={numberTagToDo}
                            annotationType={annotationType}
                            fetch={fetch}
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
        </>
    )
    
};

export default ItemsTable;