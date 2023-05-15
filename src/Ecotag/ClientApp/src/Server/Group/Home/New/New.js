import React from 'react';
import {Button, TextInput} from '@axa-fr/react-toolkit-all';
import {NAME} from './constants';
import './New.scss';
import useProjectTranslation from "../../../../useProjectTranslation";

const New = ({fields, disabled, hasSubmit, onChangeCreateGroup, onSubmitCreateGroup}) => {
    const {translate} = useProjectTranslation();

    return(
        <>
            <form name="newGroup">
                <article className="af-panel af-panel--new-group">
                    <section className="af-panel__content af-panel__content--new-group">
                        <TextInput
                            label={translate('group.new.name_input.label')}
                            name={NAME}
                            id={NAME}
                            onChange={onChangeCreateGroup}
                            helpMessage={translate('group.new.name_input.help_message')}
                            forceDisplayMessage={hasSubmit}
                            messageType="error"
                            {...fields[NAME]}
                        />
                        <Button
                            classModifier={`hasiconRight confirm ${!disabled ? 'disabled' : ''}`}
                            id="myForm"
                            onClick={onSubmitCreateGroup}
                            disabled={!disabled}>
                            <span className="af-btn-text">{translate('group.new.validation')}</span>
                            <i className="glyphicon glyphicon-arrowthin-right"/>
                        </Button>
                    </section>
                </article>
            </form>
        </>
    );
}

export default New;
