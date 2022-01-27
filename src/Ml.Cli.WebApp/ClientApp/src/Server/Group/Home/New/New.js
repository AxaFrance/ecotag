import React from 'react';
import { TextInput, Button } from '@axa-fr/react-toolkit-all';
import { NAME } from './constants';
import './New.scss';

const New = ({ fields, disabled, hasSubmit, onChangeCreateGroup, onSubmitCreateGroup }) => (
  <>
    <form name="newGroup">
      <article className="af-panel af-panel--new-group">
        <section className="af-panel__content af-panel__content--new-group">
          <TextInput
            label="Nom : "
            name={NAME}
            id={NAME}
            onChange={onChangeCreateGroup}
            helpMessage="Ex : annotateurs de rib"
            forceDisplayMessage={hasSubmit}
            messageType="error"
            {...fields[NAME]}
          />
          <Button
            classModifier={`hasiconRight confirm ${!disabled ? 'disabled' : ''}`}
            id="myForm"
            onClick={onSubmitCreateGroup}
            disabled={!disabled}>
            <span className="af-btn-text">Valider</span>
            <i className="glyphicon glyphicon-arrowthin-right" />
          </Button>
        </section>
      </article>
    </form>
  </>
);

export default New;
