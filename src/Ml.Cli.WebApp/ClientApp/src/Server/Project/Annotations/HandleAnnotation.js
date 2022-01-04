import React from 'react';
import Button from '@axa-fr/react-toolkit-button';
import './annotation.scss';

const HandleAnnotation = () => (
  <>
    <div className="ft-handle-annotation-container">
      <Button classModifier="hasiconLeft" onClick={() => console.log('Click Previous Image')}>
        <span className="af-btn__text">Précédent</span>
        <i className="glyphicon glyphicon-arrowthin-left" />
      </Button>
      <Button classModifier="hasiconRight" onClick={() => console.log('Click Next Image')}>
        <span className="af-btn__text">Suivant</span>
        <i className="glyphicon glyphicon-arrowthin-right" />
      </Button>
    </div>
  </>
);

export default HandleAnnotation;
