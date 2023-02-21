import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import Button from '@axa-fr/react-toolkit-button';
import {withRouter} from 'react-router-dom';
import './Confirm.scss';
import useProjectTranslation from "../../../../translations/useProjectTranslation";

export const Confirm = ({navBack}) => {
    const {translate} = useProjectTranslation();

    return(
        <>
            <Title title={translate('dataset.confirm.title')} goTo="/datasets" goTitle="Datasets"/>
            <Stepper activeStep="confirm" title={translate('dataset.confirm.stepper')} link="/datasets/new"/>
            <div className="af-confirm">
                <span className="glyphicon glyphicon--ring glyphicon-ok"/>
                <h2 className="af-confirm__message">{translate('dataset.confirm.confirmation_title')}</h2>
                <h4 className="af-confirm__message">{translate('dataset.confirm.confirmation_description')}</h4>
                <Button classModifier="success hasiconLeft" id="return_datatset" name="return_datatset" onClick={navBack}>
                    <span className="af-btn-text">{translate('dataset.confirm.return_button_label')}</span>
                    <span className="icons-list__item-icon glyphicon glyphicon-list-alt"/>
                </Button>
            </div>
        </>
    );
}

const ConfirmContainer = ({history}) => {
    const navBack = () => {
        history.push('/datasets');
    };
    return <Confirm navBack={navBack}/>;
};

export default withRouter(ConfirmContainer);
