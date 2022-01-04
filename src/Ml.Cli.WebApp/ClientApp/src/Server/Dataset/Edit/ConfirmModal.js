import React from "react";
import BooleanModal from "@axa-fr/react-toolkit-modal-boolean";

const ConfirmModal = ({state, setState}) => {

    const onCancel = () => {
        setState({...state, openLockModal: false});
    };

    const onSubmit = () => {
        setState({...state, isLock: true, openLockModal: false});
    };

    return (
        <BooleanModal
            isOpen={state.openLockModal}
            title='Voulez-vous verrouiller le dataset définitivement ?'
            id='modalId'
            onCancel={onCancel}
            onSubmit={onSubmit}
            submitTitle='Confirmer'
            cancelTitle='Annuler'
            className="edit-dataset__modal"
        >
            <p className="edit-dataset__modal-core-text">
                Cette action est définitive. <br />
                Toute modification (ajout, supression de fichier) sera impossible par la suite
            </p>
        </BooleanModal>
    );
};

export default ConfirmModal;
