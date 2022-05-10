import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import Button from '@axa-fr/react-toolkit-button';
import {useLocation, withRouter} from 'react-router-dom';
import './Confirm.scss';

export const Confirm = ({ navBack }) => {
    
    const location = useLocation();
    const filesResult = location.state.filesResult;
    const koFilesArray = Object.keys(filesResult).filter(key => filesResult[key] !== null);
    const containsKOFiles = koFilesArray.length > 0;
    
    return(
        <>
            <Title title="Confirmation" goTo="/datasets" goTitle="Datasets" />
            <Stepper activeStep="confirm" title="Nouveau dataset" link="/datasets/new" />
            <div className="af-confirm">
                <span className="glyphicon glyphicon--ring glyphicon-ok" />
                <h2 className="af-confirm__message">Nouveau dataset ajouté !</h2>
                {containsKOFiles &&
                    <div className="af-danger">
                        <h4>
                            Certains fichiers n'ont pas été ajoutés au dataset :
                        </h4>
                        {koFilesArray.map((koFileName, index) => (
                            <div key={index}>
                                <span className="af-danger__message">{koFileName} - {filesResult[koFileName]}</span>
                            </div>
                        ))}
                    </div>
                }
                <Button classModifier="success hasiconLeft" id="return_datatset" name="return_datatset" onClick={navBack}>
                    <span className="af-btn-text">Retour liste datasets</span>
                    <span className="icons-list__item-icon glyphicon glyphicon-list-alt" />
                </Button>
            </div>
        </>
    )
};

const ConfirmContainer = ({ history }) => {
  const navBack = () => {
    history.push('/datasets');
  };
  return <Confirm navBack={navBack} />;
};

export default withRouter(ConfirmContainer);
