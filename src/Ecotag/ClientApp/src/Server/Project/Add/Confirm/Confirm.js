import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import Button from '@axa-fr/react-toolkit-button';
import {useLocation, withRouter} from 'react-router-dom';
import './Confirm.scss';
import useProjectTranslation from '../../../../translations/useProjectTranslation';

export const Confirm = ({navBack, navViewProject}) => {
    const {translate} = useProjectTranslation();

    return(
        <>
            <Title title={translate('project.confirm.title')} goTo="/projects" goTitle="Projets"/>
            <Stepper activeStep="confirm" title={translate('project.confirm.stepper')} link="/projects/new"/>
            <div className="af-confirm">
                <span className="glyphicon glyphicon--ring glyphicon-ok"/>
                <h2 className="af-confirm__message">{translate('project.confirm.new_project_added')}</h2>
                <Button classModifier="success hasiconLeft" id="view_project" name="view_project" onClick={navViewProject}>
                    <span className="af-btn-text">{translate('project.confirm.view_project_button_label')}</span>
                    <span className="icons-list__item-icon glyphicon glyphicon-list-alt"/>
                </Button>
                <Button classModifier="success hasiconLeft" id="return_datatset" name="return_datatset" onClick={navBack}>
                    <span className="af-btn-text">{translate('project.confirm.go_back_button_label')}</span>
                    <span className="icons-list__item-icon glyphicon glyphicon-list-alt"/>
                </Button>
            </div>
        </>
    );
}

export const ConfirmContainer = ({history}) => {
    const location = useLocation();
    const projectId = location.state.projectId;
    const navBack = () => {
        history.push('/projects');
    };
    const navViewProject = () => {
        history.push(`${projectId}`);
    };
    return <Confirm navBack={navBack} navViewProject={navViewProject}/>;
};

export default withRouter(ConfirmContainer);
