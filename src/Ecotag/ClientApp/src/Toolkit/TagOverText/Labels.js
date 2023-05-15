import React, {useEffect, useRef} from 'react';
import {setFocus} from '../BoundingBox/Cropping';

import './Labels.scss';
import useProjectTranslation from "../../useProjectTranslation";

const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
        htmlElRef.current && htmlElRef.current.focus();
    };
    return [htmlElRef, setFocus];
};

const CustomInput = ({label, selectLabel, currentLabelId, onChange}) => {
    const {translate} = useProjectTranslation('toolkit');
    const [inputRef, setInputFocus] = useFocus();
    useEffect(() => {
        if (currentLabelId === label.id) {
            setInputFocus();
        }
    }, [currentLabelId]);

    let className = '';
    if (currentLabelId === label.id) {
        className = 'tagovertext-labels__input--current';
    } else if (label.label === '') {
        className = 'tagovertext-labels__input--empty';
    } else if (label.manual_rectangle) {
        className = 'tagovertext-labels__input--hasbeencreated';
    } else if (!label.hasBeenFocused) {
        className = '';
    } else if (label.label !== label.defaultLabel) {
        className = 'tagovertext-labels__input--hasbeenmodified';
    } else {
        className = 'tagovertext-labels__input--hasbeenfocused';
    }

    return (
        <input
            title={translate('tag_over_text.labels.no_shortcut')}
            className={`tagovertext-labels__input ${className}`}
            value={label.label}
            id={`text_${label.id}`}
            autoFocus={currentLabelId === label.id}
            onFocus={() => selectLabel(label.id)}
            onChange={e => onChange({id: label.id, value: e.target.value})}
            ref={inputRef}
        />
    );
};

const getConfModifier = conf => {
    if (conf >= 90) {
        return 'tagovertext-labels__input-conf--sup90';
    } else if (conf < 90 && 60 <= conf) {
        return 'tagovertext-labels__input-conf--between60and90';
    }
    return 'tagovertext-labels__input-conf--inf60';
};

const Group = ({group, currentLabelId, selectLabel, onChange}) => {
    return (
        <div className="tagovertext-labels__group-container">
            {group.map(label => (
                <div key={label.id} className="tagovertext-labels__input-container">
                    <CustomInput currentLabelId={currentLabelId} label={label} selectLabel={selectLabel}
                                 onChange={onChange}/>
                    <div className={`tagovertext-labels__input-conf ${getConfModifier(label.conf)}`}
                         title={label.conf}/>
                </div>
            ))}
        </div>
    );
};

const Groups = ({groupsOfLabels, ...otherProps}) => {
    const {translate} = useProjectTranslation('toolkit');

    return(
        <div className="tagovertext-labels__groups-container">
            {Object.keys(groupsOfLabels).map(key => (
                <div key={key}>
                    <span className="tagovertext-labels__group-title">${translate('tag_over_text.labels.groups.block')} {key}</span>
                    <Group group={groupsOfLabels[key]} {...otherProps} />
                </div>
            ))}
        </div>
    )
};

const getShapeByLabelId = (shapes, id) => shapes.find(shape => shape.labelId === id);

const getNewLabels = (labels, labelId, newProps) => {
    const label = labels.find(l => l.id === labelId);
    return [...labels.filter(l => l.id !== labelId), {...label, ...newProps}];
};

const Labels = ({setState, state, croppingHeight, croppingWidth}) => {
    const {translate} = useProjectTranslation('toolkit');

    const selectLabel = labelId => {
        const shape = getShapeByLabelId(state.shapes, labelId);
        const shapes = setFocus(state.shapes, shape.id);

        let {stageX, stageY, stageScale} = state;

        if (-shape.begin.x * stageScale > state.stageX) {
            stageX = -(shape.begin.x - 60) * stageScale;
        }
        if (-shape.end.x * stageScale < state.stageX - croppingWidth) {
            stageX = -(shape.end.x + 60) * stageScale + croppingWidth;
        }
        if (-shape.begin.y * stageScale > state.stageY) {
            stageY = -(shape.begin.y - 60) * stageScale;
        }
        if (-shape.end.y * stageScale < state.stageY - croppingHeight) {
            stageY = -(shape.begin.y + 60) * stageScale + croppingHeight;
        }

        const newLabels = getNewLabels(state.labels, labelId, {
            hasBeenFocused: true,
        });
        setState({...state, labels: newLabels, shapes, stageX, stageY});
    };

    const onChange = e => {
        const newLabels = getNewLabels(state.labels, e.id, {
            label: e.value,
            isDeleted: false,
        });
        setState({...state, labels: newLabels});
    };

    const reducer = (accumulator, currentValue) => {
        const group = currentValue.block_num.toString();
        if (!accumulator[group]) {
            accumulator[group] = [];
        }
        accumulator[group].push(currentValue);
        return accumulator;
    };
    const groupsOfLabels = state.labels.sort((a, b) => a.index - b.index).reduce(reducer, {});

    const shapeWidthFocus = state.shapes.find(s => s.focus);
    return (
        <div className="tagovertext-labels__container" style={{height: croppingHeight}}>
            <h2 className="tagovertext-labels__title">{translate('tag_over_text.labels.title')}</h2>
            <Groups
                groupsOfLabels={groupsOfLabels}
                onChange={onChange}
                data={state.data}
                currentLabelId={shapeWidthFocus ? shapeWidthFocus.labelId : ''}
                selectLabel={selectLabel}
            />
        </div>
    );
};

export default React.memo(Labels);
