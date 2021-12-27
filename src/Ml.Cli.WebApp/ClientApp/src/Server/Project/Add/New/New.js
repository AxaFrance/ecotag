import React from 'react';
import Title from 'TitleBar';
import Stepper from '../../../shared/Stepper';
import LabelInput from '../../../shared/Label/LabelInput';
import { TextInput, SelectInput, MultiSelectInput, NumberInput, Button } from '@axa-fr/react-toolkit-all';
import { GROUP, CLASSIFICATION, NAME, TYPE, LABELS, DATASET, NUMBER_CROSS_ANNOTATION } from './constants';
import './New.scss';

const New = ({ datasets, groups, fields, onChange, hasSubmit, onSubmit }) => {
  const groupsAsOptions =
    groups && groups.length > 0 ? groups.map(group => ({ label: group.name, value: group.id })) : [];
  const datasetsAsOptions =
    datasets && datasets.length > 0 ? datasets.map(dataset => ({ label: dataset.name, value: dataset.id })) : [];
  return (
    <>
      <Title title="Nouveau projet d'annotation" goTo="/projects" goTitle="Projets" />
      <Stepper title="Nouveau projet" link="/projects/new" />
      <div className="af-form">
        <form className="container" name="newProject">
          <article className="af-panel af-panel--new">
            <section className="af-panel__content af-panel__content--new-project">
              <h1 className="af-title--content">Nouveau projet d&apos;annotation</h1>
              <TextInput
                label="Nom *"
                name={NAME}
                id={NAME}
                onChange={onChange}
                helpMessage="Ex : Carte grise 2019"
                forceDisplayMessage={hasSubmit}
                messageType="error"
                {...fields[NAME]}
              />
              <SelectInput
                label="Classification"
                name={CLASSIFICATION}
                id={CLASSIFICATION}
                onChange={onChange}
                helpMessage="Ex : Critique"
                options={[
                  { value: 'Publique', label: 'Publique' },
                  { value: 'Interne', label: 'Interne' },
                  { value: 'Confidentiel', label: 'Confidentiel' },
                  { value: 'Critique', label: 'Critique' },
                ]}
                forceDisplayMessage={hasSubmit}
                messageType="error"
                {...fields[CLASSIFICATION]}
              />
              <SelectInput
                label="Type *"
                name={TYPE}
                id={TYPE}
                onChange={onChange}
                options={[
                  {
                    value: 'CROPPING',
                    label: "Séléction de zone d'image",
                  },
                  {
                    value: 'ImageClassifier',
                    label: 'Saisi de texte contenu dans une image',
                  },
                  {
                    value: 'NAMED_ENTITY',
                    label: 'Séléction de zone de texte',
                  },
                ]}
                forceDisplayMessage={hasSubmit}
                messageType="error"
                {...fields[TYPE]}
              />
              <NumberInput
                label="Nombre annotation croisée"
                onChange={onChange}
                forceDisplayMessage={hasSubmit}
                messageType="error"
                helpMessage="Croisement d'annotation réalisé par des annotateurs différents"
                {...fields[NUMBER_CROSS_ANNOTATION]}
              />
              <MultiSelectInput
                label="Dataset"
                name={DATASET}
                id={DATASET}
                onChange={onChange}
                disabled={!fields[TYPE].value}
                options={datasetsAsOptions}
                forceDisplayMessage={hasSubmit}
                messageType="error"
                {...fields[DATASET]}
              />
              <LabelInput
                forceDisplayMessage={hasSubmit}
                label="Ajouter des labels :"
                name={LABELS}
                id={LABELS}
                onChange={onChange}
                {...fields[LABELS]}
              />
              <MultiSelectInput
                label="Groupe"
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
            <span className="af-btn-text">Valider</span>
            <i className="glyphicon glyphicon-arrowthin-right" />
          </Button>
        </form>
      </div>
    </>
  );
};

export default New;
