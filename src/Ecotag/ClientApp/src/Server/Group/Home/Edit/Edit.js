import React, {useState} from 'react';
import {MultiSelectInput} from '@axa-fr/react-toolkit-form-input-select-multi';
import {MessageTypes} from '@axa-fr/react-toolkit-form-core';
import Modal from '@axa-fr/react-toolkit-modal-default';

import "./Edit.scss";
import useProjectTranslation from "../../../../translations/useProjectTranslation";

const Users = ({idGroup, users, eligibleUsers, setUsersToSubmit}) => {
    const {translate} = useProjectTranslation();

    return (
        <form className="af-form-multi-select-users" onSubmit={(event) => event.preventDefault()}>
            <MultiSelectInput
                label={''}
                name={`group_${idGroup}`}
                options={eligibleUsers}
                onChange={data => setUsersToSubmit(data.values)}
                values={users}
                messageType={MessageTypes.error}
                forceDisplayMessage={false}
                readOnly={false}
                disabled={false}
                isVisible={true}
                className={'multi-select-users'}
                classModifier={'multi-select-users'}
                placeholder={translate('group.list.edit_popup.add_user_placeholder')}
                classNameContainerLabel={'classNameContainerLabel'}
                classNameContainerInput={'classNameContainerInput'}
            />
        </form>
    );
}

const Edit = ({
                  idGroup,
                  users,
                  eligibleUsers,
                  onUpdateUser,
                  isManageUsersModalVisible,
                  setManageUsersModalVisible,
              }) => {
    const actualUsers = users.map(user => user.email);
    const [usersToSubmit, setUsersToSubmit] = useState(actualUsers);
    const {translate} = useProjectTranslation();
    const eligibleEmailsUsers = eligibleUsers.map(user => user.email);
    const eligibleUsersOptions = [...actualUsers, ...eligibleEmailsUsers].map(email => ({
        value: email,
        label: email,
        clearableValue: true,
    }));

    const findUsersIds = usersEmails => {
        const usersIds = [];
        for (let user of [...users, ...eligibleUsers]) {
            if (usersEmails.includes(user.email)) {
                usersIds.push(user.id);
            }
        }
        return usersIds;
    }

    return (
        <Modal
            className="af-modal af-modal--group-edit"
            classModifier={"group-edit"}
            isOpen={isManageUsersModalVisible}
            onOutsideTap={() => setManageUsersModalVisible(false)}>
            <Modal.HeaderBase>
                <p>{translate('group.list.edit_popup.header')}</p>
            </Modal.HeaderBase>
            <Modal.Body>
                <Users
                    idGroup={idGroup}
                    users={usersToSubmit}
                    eligibleUsers={eligibleUsersOptions}
                    setUsersToSubmit={setUsersToSubmit}
                />
            </Modal.Body>
            <Modal.Footer>
                <button className="btn af-btn af-btn--reverse" type="button"
                        onClick={() => setManageUsersModalVisible(false)}>
                    {translate('group.list.edit_popup.footer.cancel')}
                </button>
                <button
                    className="btn af-btn"
                    aria-label="SubmitUpdate"
                    type="button"
                    onClick={() => {
                        onUpdateUser(idGroup, findUsersIds(usersToSubmit));
                        setManageUsersModalVisible(false);
                        return false;
                    }}>
                    {translate('group.list.edit_popup.footer.validation')}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default Edit;
