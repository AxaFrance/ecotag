import React from "react";
import BooleanModal from "@axa-fr/react-toolkit-modal-boolean";
import './ConfirmModal.scss';

const ConfirmModal = ({title, isOpen, onCancel, onSubmit, children}) => (
    <BooleanModal
        isOpen={isOpen}
        title={title}
        onCancel={onCancel}
        onSubmit={onSubmit}
        submitTitle='Confirmer'
        cancelTitle='Annuler'
    >
        {children}
    </BooleanModal>
);

export default ConfirmModal;
