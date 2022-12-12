import React from 'react';
import {Step, StepBase, Steps} from '@axa-fr/react-toolkit-all';
import './Stepper.scss';

const Stepper = ({activeStep, link, title}) => (
    <Steps classModifier="devis" className="af-steps-new">
        <Step id="id1" href={link} onClick={() => {
        }} number="1" title={title} icon="glyphicon-arrow-rounded-right"/>
        <StepBase id="idf4" title="Confirmation" classModifier={`${activeStep === 'confirm' ? 'success' : ''}`}>
            <div className="af-steps-list-stepLabel" onClick={() => {
            }}>

                <span className="af-steps-list-stepTitle">Confirmation</span>
            </div>
        </StepBase>
    </Steps>
);

export default Stepper;
