import React from 'react';
import Title from 'TitleBar';
import Stepper from '../../../shared/Stepper';
import Button from '@axa-fr/react-toolkit-button';
import { useLocation, withRouter } from 'react-router-dom';
import './Confirm.scss';

export const Confirm = ({ navBack, navViewProject }) => (
  <>
    <Title title="Confirmation" goTo="/projects" goTitle="Projets" />
    <Stepper activeStep="confirm" title="Nouveau projet" link="/projects/new" />
    <div className="af-confirm">
      <span className="glyphicon glyphicon--ring glyphicon-ok" />
      <h2 className="af-confirm__message">Nouveau projet ajouté !</h2>
      <Button classModifier="success hasiconLeft" id="view_project" name="view_project" onClick={navViewProject}>
        <span className="af-btn-text">Visualiser le projet</span>
        <span className="icons-list__item-icon glyphicon glyphicon-list-alt" />
      </Button>
      <Button classModifier="success hasiconLeft" id="return_datatset" name="return_datatset" onClick={navBack}>
        <span className="af-btn-text">Retour liste des projets</span>
        <span className="icons-list__item-icon glyphicon glyphicon-list-alt" />
      </Button>
    </div>
  </>
);

export const ConfirmContainer = ({ history }) => {
  const location = useLocation();
  const project = location.state.project;
  const navBack = () => {
    history.push('/');
  };
  const navViewProject = () => {
    history.push(`${project.id}`);
  };
  return <Confirm navBack={navBack} navViewProject={navViewProject} />;
};

export default withRouter(ConfirmContainer);
