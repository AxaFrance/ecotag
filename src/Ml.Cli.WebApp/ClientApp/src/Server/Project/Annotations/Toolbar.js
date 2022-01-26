import React from 'react';
import Button from '@axa-fr/react-toolkit-button';
import './annotation.scss';
import {resilienceStatus} from "../../shared/Resilience"

const Toolbar = ({onNext, onPrevious, filename, status}) => (
  <>
    <div className="ft-handle-annotation-container">
      <Button classModifier="hasiconLeft" onClick={onNext}>
        <span className="af-btn__text">Précédent</span>
        <i className="glyphicon glyphicon-arrowthin-left" />
      </Button>
      <span>{filename}</span>
      {status === resilienceStatus.LOADING ?? <span>Chargement des prochaines annotation ...</span>}
      {status === resilienceStatus.ERROR ?? <span>Erreur lors du chargement des prochaine annotation ...</span>}
      
      <Button classModifier="hasiconRight" onClick={onPrevious}>
        <span className="af-btn__text">Suivant</span>
        <i className="glyphicon glyphicon-arrowthin-right" />
      </Button>
    </div>
  </>
);

export default Toolbar;
