import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import {Button, MultiSelectInput, SelectInput, TextInput} from '@axa-fr/react-toolkit-all';
import {CheckboxInput, CheckboxModes} from '@axa-fr/react-toolkit-form-input-checkbox';
import HelpButton from '@axa-fr/react-toolkit-help';
import '@axa-fr/react-toolkit-alert/dist/alert.scss';
import '@axa-fr/react-toolkit-popover/dist/popover.scss';
import './New.scss';
import {CLASSIFICATION, DATASETS_IMPORT, GROUP, IMPORTED_DATASET_NAME, NAME, TYPE} from './constants';
import useProjectTranslation from '../../../../useProjectTranslation';

const groupsAsOptions = (groups) => groups && groups.length > 0 ? groups.map(group => ({
    label: group.name,
    value: group.id
})) : [];

const datasetsAsOptions = (datasets) => datasets && datasets.length > 0 ? datasets.map(dataset => ({
    label: dataset.substring(dataset.indexOf('/') + 1),
    value: dataset
})) : [];

const New = ({fields, onChange, hasSubmit, onSubmit, groups, optionsDatasets}) => {
    const {translate} = useProjectTranslation();

    const datasetsImportOptions = [
        {
            key: "checkbox_areDatasetsImported",
            id: "are_datasets_imported_checkbox",
            value: "datasetsValue",
            label: translate('dataset.new.import_input.label'),
            disabled: false
        }
    ];

    return (
        <>
            <Title title={translate('dataset.new.title')} goTo="/datasets" goTitle="Datasets"/>
            <Stepper title={translate('dataset.new.stepper.title')} link="/datasets/new"/>
            <div className="af-form">
                <form className="container" name="newDataset">
                    <h1 className="af-title--content">{translate('dataset.new.form_title')}</h1>
                    <article className="af-panel">
                        <section className="af-panel__content af-panel__content--new-dataset">
                            <TextInput
                                label={translate('dataset.new.name_input.label')}
                                name={NAME}
                                id={NAME}
                                onChange={onChange}
                                helpMessage={translate('dataset.new.name_input.help_message')}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[NAME]}
                            />
                            <MultiSelectInput
                                label={translate('dataset.new.team_input.label')}
                                name={GROUP}
                                id={GROUP}
                                onChange={onChange}
                                options={groupsAsOptions(groups)}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[GROUP]}/>
                            <SelectInput
                                label={translate('dataset.new.type_input.label')}
                                name={TYPE}
                                id={TYPE}
                                helpMessage={translate('dataset.new.type_input.help_message')}
                                onChange={onChange}
                                options={[
                                    {value: 'Image', label: translate('dataset.new.type_input.options_labels.image')},
                                    {value: 'Document', label: translate('dataset.new.type_input.options_labels.document')},
                                    {value: 'Text', label: translate('dataset.new.type_input.options_labels.text')},
                                    {value: 'Eml', label: translate('dataset.new.type_input.options_labels.eml')},
                                ]}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[TYPE]}
                            >
                                <HelpButton mode="click" classModifier="classifications">
                                    <h2>{translate('dataset.new.type_input.help.title')}</h2>
                                    <ul>
                                        <li>
                                            <span> <b>{translate('dataset.new.type_input.help.images.name')}</b>{translate('dataset.new.type_input.help.images.types')}</span>
                                        </li>
                                        <li>
                                            <span><b>{translate('dataset.new.type_input.help.documents.name')}</b>{translate('dataset.new.type_input.help.documents.types')}</span>
                                        </li>
                                        <li>
                                            <span><b>{translate('dataset.new.type_input.help.text.name')}</b>{translate('dataset.new.type_input.help.text.types')}</span>
                                        </li>
                                        <li>
                                            <span><b>{translate('dataset.new.type_input.help.eml.name')}</b>{translate('dataset.new.type_input.help.eml.types')}</span>
                                        </li>
                                    </ul>
                                </HelpButton>
                            </SelectInput>
                            <SelectInput
                                label={translate('dataset.new.classification_input.label')}
                                name={CLASSIFICATION}
                                id={CLASSIFICATION}
                                helpMessage={translate('dataset.new.classification_input.help_message')}
                                onChange={onChange}
                                options={[
                                    {value: 'Public', label: translate('dataset.new.classification_input.options.public.label')},
                                    {value: 'Internal', label: translate('dataset.new.classification_input.options.internal.label')},
                                    {value: 'Confidential', label: translate('dataset.new.classification_input.options.confidential.label')},
                                    {value: 'Critical', label: translate('dataset.new.classification_input.options.critical.label')},
                                ]}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                {...fields[CLASSIFICATION]}>
                                <HelpButton mode="click" classModifier="classifications">
                                    <h2>{translate('dataset.new.classification_input.help.title')}</h2>
                                    <ul>
                                        <li>
                                            <span> <b>{translate('dataset.new.classification_input.help.public.name')}</b>{translate('dataset.new.classification_input.help.public.detail')}</span>
                                        </li>
                                        <li>
                                            <span><b>{translate('dataset.new.classification_input.help.internal.name')}</b>{translate('dataset.new.classification_input.help.internal.detail')}</span>
                                        </li>
                                        <li>
                                            <span><b>{translate('dataset.new.classification_input.help.confidential.name')}</b>{translate('dataset.new.classification_input.help.confidential.detail')}</span>
                                        </li>
                                        <li>
                                            <span><b>{translate('dataset.new.classification_input.help.critical.name')}</b>{translate('dataset.new.classification_input.help.critical.detail')}</span>
                                        </li>
                                    </ul>
                                </HelpButton>
                            </SelectInput>
                            <CheckboxInput
                                name={DATASETS_IMPORT}
                                id={DATASETS_IMPORT}
                                mode={CheckboxModes.toggle}
                                label={translate('dataset.new.import_input.label')}
                                onChange={onChange}
                                options={datasetsImportOptions}
                                {...fields[DATASETS_IMPORT]}
                            />
                            <SelectInput
                                label={translate('dataset.new.dataset_to_import.label')}
                                name={IMPORTED_DATASET_NAME}
                                id={IMPORTED_DATASET_NAME}
                                onChange={onChange}
                                forceDisplayMessage={hasSubmit}
                                messageType="error"
                                options={datasetsAsOptions(optionsDatasets)}
                                forceDisplayPlaceholder={true}
                                {...fields[IMPORTED_DATASET_NAME]}
                            />
                        </section>
                    </article>
                    <Button classModifier="hasiconRight confirm" id="myForm" onClick={onSubmit}>
                        <span className="af-btn-text">{translate('dataset.new.validate')}</span>
                        <i className="glyphicon glyphicon-arrowthin-right"/>
                    </Button>
                </form>
            </div>
        </>
    );
}

export default New;
