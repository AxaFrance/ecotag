import React from 'react';
import Title from 'TitleBar';
import Stepper from '../../../shared/Stepper';
import Button from '@axa-fr/react-toolkit-button';
import { withRouter } from 'react-router-dom';
import './Confirm.scss';

export const Confirm = ({ navBack }) => (
  <>
      <Title title="Confirmation" goTo="/datasets" goTitle="Datasets" />
    <Stepper activeStep="confirm" title="Nouveau dataset" link="/datasets/new" />
    <div className="af-confirm">
      <span className="glyphicon glyphicon--ring glyphicon-ok" />
      <h2 className="af-confirm__message">Nouveau dataset ajouté !</h2>
      <Button classModifier="success hasiconLeft" id="return_datatset" name="return_datatset" onClick={navBack}>
        <span className="af-btn-text">Retour liste datatsets</span>
        <span className="icons-list__item-icon glyphicon glyphicon-list-alt" />
      </Button>
    </div>
  </>
);

const ConfirmContainer = ({ history }) => {
  const navBack = () => {
    history.push('/datasets');
  };
  return <Confirm navBack={navBack} />;
};

export default withRouter(ConfirmContainer);
