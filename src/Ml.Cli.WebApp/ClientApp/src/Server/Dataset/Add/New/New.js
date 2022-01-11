import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import { TextInput, SelectInput, Button } from '@axa-fr/react-toolkit-all';
import HelpButton from '@axa-fr/react-toolkit-help';
import '@axa-fr/react-toolkit-alert/dist/alert.scss';
import '@axa-fr/react-toolkit-popover/dist/popover.scss';
import './New.scss';
import { NAME, CLASSIFICATION, TYPE, FILES } from './constants';

const New = ({ fields, onChange, hasSubmit, onSubmit }) => (
  <>
      <Title title=" Nouveau dataset" goTo="/datasets" goTitle="Datasets" />
    <Stepper title="Nouveau dataset" link="/datasets/new" />
    <div className="af-form">
      <form className="container" name="newDataset">
        <h1 className="af-title--content">Nouveau dataset</h1>
        <article className="af-panel">
          <section className="af-panel__content af-panel__content--new-dataset">
            <TextInput
              label="Nom *"
              name={NAME}
              id={NAME}
              onChange={onChange}
              helpMessage="Ex : Meunier"
              forceDisplayMessage={hasSubmit}
              messageType="error"
              {...fields[NAME]}
            />
            <SelectInput
              label="Type *"
              name={TYPE}
              id={TYPE}
              helpMessage="Ex : Guillaume Chervet"
              onChange={onChange}
              options={[
                { value: 'Image', label: 'Images (.jpg, .png)' },
                { value: 'Text', label: 'Text (.txt)' },
              ]}
              forceDisplayMessage={hasSubmit}
              messageType="error"
              {...fields[TYPE]}
            />
            <SelectInput
              label="Classification *"
              name={CLASSIFICATION}
              id={CLASSIFICATION}
              helpMessage="Ex : Critique"
              onChange={onChange}
              options={[
                { value: 'Publique', label: 'Publique' },
                { value: 'Interne', label: 'Interne' },
                { value: 'Confidentiel', label: 'Confidentiel' },
                { value: 'Critique', label: 'Critique' },
              ]}
              forceDisplayMessage={hasSubmit}
              messageType="error"
              {...fields[CLASSIFICATION]}>
              <HelpButton mode="click" classModifier="classifications">
               <h2>Information sur les criticités</h2>
                  <ul>
                      <li>
                          <span> <b>Public</b> : Une information créée délibérément pour le publique, ou spécifiquement conçue pour diffusion dans le public</span>
                      </li>
                      <li>
                          <span><b>Interne</b>: Une information accessible à l'ensemble ou à une large partie des salariés qui n'est pas destinée à des personnes extérieures</span>
                      </li>
                      <li>
                          <span><b>Confidentiel</b>: Une information dont l'accès est limité à un auditoire spécifiquement</span>
                      </li>
                      <li>
                          <span><b>Critique</b>: Une information dont l'accès est limité à un auditoire très restreint</span>
                      </li>
                  </ul>
              </HelpButton>
            </SelectInput>
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

export default New;
