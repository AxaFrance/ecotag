import React from 'react';
import Title from 'TitleBar';
import Stepper from '../../../shared/Stepper';
import { TextInput, SelectInput, FileInput, Button } from '@axa-fr/react-toolkit-all';
import HelpButton from '@axa-fr/react-toolkit-help';
import Alert from '@axa-fr/react-toolkit-alert';
import '@axa-fr/react-toolkit-alert/dist/alert.scss';
import '@axa-fr/react-toolkit-popover/dist/popover.scss';
import './New.scss';
import { NAME, CLASSIFICATION, TYPE, FILES } from './constants';

import classifications from './classifications.png';

const New = ({ fields, onChange, hasSubmit, onSubmit }) => (
  <>
      <Title title=" Nouveau dataset" goTo="/datasets" goTitle="Datasets" />
    <Stepper title="Nouveau dataset" link="/datasets/new" />
    <div className="af-form">
      <form className="container" name="newDataset">
        <h1 className="af-title--content">Nouveau dataset</h1>
        <article className="af-panel">
          <section className="af-panel__content">
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
                Information sur les criticités:
                <img alt="tableau des classifications" src={classifications} />
              </HelpButton>
            </SelectInput>
            <FileInput
              label="Fichiers"
              name={FILES}
              id={FILES}
              accept="image/jpeg, image/png, text/*"
              onChange={onChange}
              helpMessage="Upload your data : image/jpeg, image/png, text/*"
              {...fields[FILES]}
              multiple
            />
            <Alert classModifier="danger" icon="upload" title="Metadatas obligatoires pour chaque fichier">
              <ul>
                <li>
                  <b>IdSouce</b>: l&apos;identifiant de la donnée dans le référentiel source. exemple:
                  8e1ed568-b783-4ed0-83b0-746308417d1f
                </li>
                <li>
                  <b>Source</b>: le nom de la source. exemple: GED
                </li>
                <li>
                  <b>Classification</b>: classification des données. exemple: Privé, Publique, Confidentiel
                </li>
              </ul>
            </Alert>
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
