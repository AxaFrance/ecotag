import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import LabelInput from '../../../shared/Label/LabelInput';
import {Button, MultiSelectInput, NumberInput, SelectInput, TextInput} from '@axa-fr/react-toolkit-all';
import {DATASET, GROUP, LABELS, NAME, NUMBER_CROSS_ANNOTATION, TYPE} from './constants';
import './New.scss';
import useProjectTranslation from "../../../../translations/useProjectTranslation";

const New = ({datasets, groups, fields, onChange, hasSubmit, onSubmit}) => {
    const {translate} = useProjectTranslation();
    const groupsAsOptions =
        groups && groups.length > 0 ? groups.map(group => ({label: group.name, value: group.id})) : [];
    const datasetsAsOptions =
        datasets && datasets.length > 0 ? datasets.map(dataset => ({label: dataset.name, value: dataset.id})) : [];
    return (
        <>
            <Title title={translate('project.new.title')} goTo="/projects" goTitle="Projets"/>
            <Stepper title={translate('project.new.stepper')} link="/projects/new"/>
            <div className="af-form">
                <form className="container" name="newProject">
                    <article className="af-panel af-panel--new">
                        <section className="af-panel__content af-panel__content--new-project">
                            <h1 className="af-title--content">{translate('project.new.title')}</h1>
                            <TextInput
                                label={translate('project.new.name_input.label')}
                                name={NAME}
                                id={NAME}
                                onChange={onChange}
                                helpMessage={translate('project.new.name_input.help_message')}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[NAME]}
                            />
                            <MultiSelectInput
                                label={translate('project.new.dataset_input.label')}
                                name={DATASET}
                                id={DATASET}
                                onChange={onChange}
                                options={datasetsAsOptions}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[DATASET]}
                            />
                            <SelectInput
                                label={translate('project.new.type_input.label')}
                                name={TYPE}
                                id={TYPE}
                                disabled={!fields[DATASET].value}
                                forceDisplayPlaceholder={true}
                                onChange={onChange}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[TYPE]}
                            />
                            <NumberInput
                                label={translate('project.new.nb_cross_annotation_input.label')}
                                onChange={onChange}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                helpMessage={translate('project.new.nb_cross_annotation_input.help_message')}
                                {...fields[NUMBER_CROSS_ANNOTATION]}
                            />
                            <LabelInput
                                forceDisplayMessage={hasSubmit}
                                label={translate('project.new.labels_input.label')}
                                name={LABELS}
                                id={LABELS}
                                onChange={onChange}
                                {...fields[LABELS]}
                            />
                            <MultiSelectInput
                                label={translate('project.new.team_input.label')}
                                name={GROUP}
                                id={GROUP}
                                onChange={onChange}
                                options={groupsAsOptions}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[GROUP]}
                            />
                        </section>
                    </article>
                    <Button classModifier="hasiconRight confirm" id="myForm" onClick={onSubmit}>
                        <span className="af-btn-text">{translate('project.new.confirmation_button_label')}</span>
                        <i className="glyphicon glyphicon-arrowthin-right"/>
                    </Button>
                </form>
            </div>
        </>
    );
};

export default New;
