import New from './New';
import {rules} from './New.validation.rules';
import React, {useReducer} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchCreateProject} from '../../Project.service';
import {computeInitialStateErrorMessage, genericHandleChange} from '../../../validation.generic';
import {
    DATASET,
    GROUP, LABEL_NUMBER,
    LABELS,
    MSG_DUPLICATE_LABEL_NAME,
    MSG_MAX_LABELS_LENGTH,
    MSG_MAX_LENGTH,
    MSG_MIN_LENGTH,
    MSG_PROJECT_NAME_ALREADY_EXIST,
    MSG_REQUIRED,
    MSG_TEXT_REGEX,
    NAME,
    NUMBER_CROSS_ANNOTATION,
    TYPE,
    TYPE_CROPPING,
    TYPE_DOCUMENT_CLASSIFIER, TYPE_DOCUMENT_OCR,
    TYPE_EML_CLASSIFIER,
    TYPE_IMAGE_CLASSIFIER,
    TYPE_NAMED_ENTITY,
    TYPE_OCR,
    TYPE_ROTATION
} from './constants';
import compose from '../../../compose';
import withCustomFetch from '../../../withCustomFetch';
import {init} from './New.hook';
import {resilienceStatus, withResilience} from '../../../shared/Resilience';
import {telemetryEvents, withTelemetry} from '../../../Telemetry';

const errorList = fields => Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = key => fields => fields[key].message !== null;

const hasDuplicates = array => {
    return (new Set(array)).size !== array.length;
};

const getLabelsNames = array => {
    return array.map(label => label.name);
}

const preInitState = {
    groups: [],
    datasets: [],
    projects: [],
    hasSubmit: false,
    status: resilienceStatus.LOADING,
    fields: {
        [NAME]: {name: NAME, value: '', message: MSG_REQUIRED},
        [DATASET]: {name: DATASET, value: '', message: MSG_REQUIRED},
        [GROUP]: {name: GROUP, value: '', message: MSG_REQUIRED},
        [TYPE]: {name: TYPE, value: '', message: MSG_REQUIRED, options: []},
        [NUMBER_CROSS_ANNOTATION]: {
            name: NUMBER_CROSS_ANNOTATION,
            value: null,
            message: MSG_REQUIRED,
        },
        [LABELS]: {
            name: LABELS,
            values: [],
            message: MSG_REQUIRED,
        },
    },
};

export const initState = computeInitialStateErrorMessage(preInitState, rules);

export const reducer = (state, action) => {
    switch (action.type) {
        case 'init': {
            const {groups, datasets, projects, status} = action.data;
            return {
                ...state,
                status,
                groups,
                datasets,
                projects,
            };
        }
        case 'onChange': {
            const event = action.event;
            const name = event.name;
            const newValues = event.values;
            const fields = state.fields;
            let newFields;
            switch (name) {
                case LABELS:
                    let message = null;
                    if (newValues.length === 0) {
                        message = MSG_REQUIRED
                    } else if (newValues.length > 90) {
                        message = MSG_MAX_LABELS_LENGTH
                    } else if (hasDuplicates(getLabelsNames(newValues))) {
                        message = MSG_DUPLICATE_LABEL_NAME;
                    } else {
                        newValues.forEach(function (value, index) {
                            if (value.name.length < 3) {
                                message = `${LABEL_NUMBER} ${index + 1} : ${MSG_MIN_LENGTH}`
                            } else if (value.name.length > 48) {
                                message = `${LABEL_NUMBER} ${index + 1} : ${MSG_MAX_LENGTH}`
                            } else if (!value.name.match(/^[a-zA-Z0-9-_]*$/)) {
                                message = `${LABEL_NUMBER} ${index + 1} : ${MSG_TEXT_REGEX}`
                            }
                        })
                    }
                    newFields = {
                        ...fields,
                        [name]: {
                            ...fields[name],
                            message,
                            values: newValues,
                        }
                    };
                    break;
                default:
                    newFields = genericHandleChange(rules, fields, event);
                    if (NAME === name) {
                        if (state.projects.find(project => project.name.toLocaleLowerCase() === event.value.toLocaleLowerCase())) {
                            newFields = {
                                ...newFields,
                                [name]: {
                                    ...newFields[name],
                                    message: MSG_PROJECT_NAME_ALREADY_EXIST
                                }
                            };
                        }
                    } else if (DATASET === name) {

                        const options = [{
                            value: 'Cropping',
                            label: TYPE_CROPPING,
                            type: "Image"
                        },
                            {
                                value: 'ImageClassifier',
                                label: TYPE_IMAGE_CLASSIFIER,
                                type: "Image"
                            },
                            {
                                value: 'Ocr',
                                label: TYPE_OCR,
                                type: "Image"
                            },
                            {
                                value: 'NamedEntity',
                                label: TYPE_NAMED_ENTITY,
                                type: "Text"
                            },
                            {
                                value: 'Rotation',
                                label: TYPE_ROTATION,
                                type: "Image"
                            },
                            {
                                value: 'EmlClassifier',
                                label: TYPE_EML_CLASSIFIER,
                                type: "Eml"
                            },
                            {
                                value: 'DocumentClassifier',
                                label: TYPE_DOCUMENT_CLASSIFIER,
                                type: "Document"
                            },
                            {
                                value: 'DocumentOcr',
                                label: TYPE_DOCUMENT_OCR,
                                type: "Document"
                            }];
                        const datasetId = event.value;
                        const datasetType = state.datasets.find(dataset => dataset.id === datasetId).type;
                        const reducer = (previousValue, currentValue) => {
                            if (currentValue.type === datasetType) {
                                previousValue.push({value: currentValue.value, label: currentValue.label});
                            }
                            return previousValue;
                        }

                        newFields = {
                            ...newFields,
                            [TYPE]: {
                                ...fields[TYPE],
                                value: '',
                                message: MSG_REQUIRED,
                                options: options.reduce(reducer, [])
                            }
                        };

                        return {
                            ...state,
                            fields: newFields,
                        };
                    }
                    break;
            }

            return {
                ...state,
                fields: newFields,
            };
        }
        case 'onSubmit': {
            return {
                ...state,
                hasSubmit: true,
            };
        }
        case 'onSubmitStarted': {
            return {
                ...state,
                status: resilienceStatus.LOADING,
            };
        }
        case 'onSubmitEnded': {
            return {
                ...state,
                status: resilienceStatus.ERROR,
            };
        }
        default:
            throw new Error();
    }
};

export const createProject = async (history, fetch, state, dispatch, telemetry) => {
    const errors = errorList(state.fields);
    dispatch({type: 'onSubmit'});
    if (errors.length) {
        return;
    }
    dispatch({type: 'onSubmitStarted'});
    const newProject = {
        name: state.fields[NAME].value,
        datasetId: state.fields[DATASET].value,
        groupId: state.fields[GROUP].value,
        annotationType: state.fields[TYPE].value,
        numberCrossAnnotation: state.fields[NUMBER_CROSS_ANNOTATION].value,
        labels: state.fields[LABELS].values,
    };
    const response = await fetchCreateProject(fetch)(newProject);
    if (response.status >= 500) {
        dispatch({type: 'onSubmitEnded'});
    } else {
        telemetry.trackEvent(telemetryEvents.CREATE_PROJECT);
        history.push({
            pathname: '/projects/confirm',
            state: {projectId: await response.json()},
        });
    }
};

const useNew = (fetch, history, telemetry) => {
    const [state, dispatch] = useReducer(reducer, initState);
    const onChange = event => dispatch({type: 'onChange', event});
    const onSubmit = () => createProject(history, fetch, state, dispatch, telemetry);
    React.useEffect(() => {
        init(fetch, dispatch)();
    }, []);
    return {state, onChange, onSubmit};
};

const NewWithResilience = withResilience(New);

export const NewContainer = ({fetch, history, telemetry}) => {
    const {state, onChange, onSubmit} = useNew(fetch, history, telemetry);
    return <NewWithResilience {...state} onChange={onChange} onSubmit={onSubmit}/>;
};


const enhance = compose(withCustomFetch(fetch), withRouter, withTelemetry);
const EnhancedNewContainer = enhance(NewContainer);

export default EnhancedNewContainer;
