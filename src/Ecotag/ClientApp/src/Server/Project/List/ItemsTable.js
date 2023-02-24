import HeaderColumnCell from './ColumnHeader';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Table, {Paging} from '@axa-fr/react-toolkit-table';
import Action from '@axa-fr/react-toolkit-action';
import {formatTimestampToString} from '../../date';
import {fetchAnnotationsStatus} from '../Project.service';
import {resilienceStatus} from '../../shared/Resilience';
import {Popover} from '@axa-fr/react-toolkit-all';
import {ProgressBar} from './ProgressBar';
import useProjectTranslation from '../../../translations/useProjectTranslation';

const NumberTagToDo = ({state}) => {
    const {translate} = useProjectTranslation();
    const {ERROR, SUCCESS, LOADING} = resilienceStatus;
    const annotationsStatus = state.annotationsStatus;
    return <>{{
        [LOADING]: <span>{translate('project.projects_list.list.nb_tags_to_do.resilience.loading')}</span>,
        [ERROR]: (
            <span>{translate('project.projects_list.list.nb_tags_to_do.resilience.error')}</span>
        ),
        [SUCCESS]: <>
            <div className="projects-af-popover__wrapper">
                <Popover
                    placement="top"
                    classModifier="project-home"
                >
                    <Popover.Pop>
                        <h3>{translate('project.projects_list.list.nb_tags_to_do.title')}</h3>
                        <table>
                            <tr>
                                <td>{translate('project.projects_list.list.nb_tags_to_do.to_do')}</td>
                                <td>{translate('project.projects_list.list.nb_tags_to_do.done')}</td>
                                <td>{translate('project.projects_list.list.nb_tags_to_do.remaining')}</td>
                            </tr>
                            <tr>
                                <td>{annotationsStatus.numberAnnotationsToDo}</td>
                                <td>{annotationsStatus.numberAnnotationsDone}</td>
                                <td>{annotationsStatus.numberAnnotationsToDo - annotationsStatus.numberAnnotationsDone}</td>
                            </tr>
                        </table>
                    </Popover.Pop>
                    <Popover.Over>
                        <ProgressBar percentage={annotationsStatus.percentageNumberAnnotationsDone}
                                     label={annotationsStatus.percentageNumberAnnotationsDone === 100 ?
                                         translate('project.projects_list.list.nb_tags_to_do.percentage.done') :
                                         translate('project.projects_list.list.nb_tags_to_do.percentage.pending')}
                        />
                    </Popover.Over>
                </Popover>
            </div>
        </>
    }[state.status]
    }
    </>

}


const initAsync = (fetch) => async (state, setState, id) => {

    const annotationsStatusResponse = await fetchAnnotationsStatus(fetch)(id);
    if (annotationsStatusResponse.status >= 500 || annotationsStatusResponse.status === 403) {
        const data = {
            ...state,
            status: annotationsStatusResponse.status === 403 ? resilienceStatus.FORBIDDEN : resilienceStatus.ERROR
        };
        setState(data);
    } else {
        const annotationsStatus = await annotationsStatusResponse.json();
        const data = {annotationsStatus, status: resilienceStatus.SUCCESS};
        setState(data);
    }

}

const ProjectRow = ({id, name, groupName, createDate, annotationType, fetch}) => {
    const history = useHistory();
    const {translate} = useProjectTranslation();
    const projectPageButton = id => {
        const path = `/projects/${id}`;
        history.push(path);
    };
    const [state, setState] = useState({
        annotationsStatus: {
            isAnnotationClosed: true,
            numberAnnotationsByUsers: [],
            numberAnnotationsDone: 0,
            numberAnnotationsToDo: 0,
            percentageNumberAnnotationsDone: 0
        },
        status: resilienceStatus.LOADING
    })
    useEffect(async () => {
        initAsync(fetch)(state, setState, id);
    }, []);

    return (
        <Table.Tr key={id}>
            <Table.Td>{name}</Table.Td>
            <Table.Td>{groupName}</Table.Td>
            <Table.Td>{createDate}</Table.Td>
            <Table.Td>{annotationType}</Table.Td>
            <Table.Td>
                <NumberTagToDo state={state}/>
            </Table.Td>
            <Table.Td>
                <Action id="id" icon="zoom-in" title={translate('project.projects_list.list.headers.edit')} onClick={() => projectPageButton(id)}/>
            </Table.Td>
        </Table.Tr>
    );
};

const ItemsTable = ({items, filters, onChangePaging, onChangeSort, fetch}) => {
    const {translate} = useProjectTranslation();

    return (
        <>
            <Table>
                <Table.Header>
                    <Table.Tr>
                        <HeaderColumnCell
                            onChangeSort={onChangeSort('name')}
                            headerColumnName={translate('project.projects_list.list.headers.name')}
                            filterColumnValue={filters.columns.name.value}
                        />
                        <HeaderColumnCell
                            onChangeSort={onChangeSort('groupName')}
                            headerColumnName={translate('project.projects_list.list.headers.team')}
                            filterColumnValue={filters.columns.groupName.value}
                        />
                        <HeaderColumnCell
                            onChangeSort={onChangeSort('createDate')}
                            headerColumnName={translate('project.projects_list.list.headers.creation_date')}
                            filterColumnValue={filters.columns.createDate.value}
                        />
                        <HeaderColumnCell
                            onChangeSort={onChangeSort('annotationType')}
                            headerColumnName={translate('project.projects_list.list.headers.annotation_type')}
                            filterColumnValue={filters.columns.annotationType.value}
                        />
                        <HeaderColumnCell
                            headerColumnName={translate('project.projects_list.list.headers.status')}
                        />
                        <Table.Th classModifier="sortable">
                            <span className="af-table__th-content af-btn__text">{translate('project.projects_list.list.headers.action')}</span>
                        </Table.Th>
                    </Table.Tr>
                </Table.Header>
                <Table.Body>
                    {items.map(({id, name, groupName, createDate, numberTagToDo, annotationType}) => (
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
                displayLabel={translate('paging.display')}
                elementsLabel={translate('paging.elements')}
                previousLabel={translate('paging.previous')}
                nextLabel={translate('paging.next')}
            />
        </>
    )

};

export default ItemsTable;