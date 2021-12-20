import React, {useState} from 'react';
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import Lock from "./Lock";
import ConfirmModal from "./ConfirmModal";
import './Edit.scss';
import Title from "../../shared/Title/Title.container";
import {computeNumberPages, filterPaging} from "../../shared/filtersUtils";


export const EditContainer = () => {
    const [state, setState] = useState({
        filesLoad: [],
        filesSend: [],
        fileData: null,
        openLockModal: false,
        isLock: false,
        paging: {
            numberPages: computeNumberPages([], 10),
            currentPages: 1,
            itemByPages: 5,
            itemFiltered: filterPaging([], 10, 1)
        }
    });

    return (
        <div className="edit-dataset">
            <ConfirmModal state={state} setState={setState}/>
            <Title back>Edition du dataset</Title>
            <FileUpload state={state} setState={setState}/>
            {state.filesSend.length === 0 ? null : <FileList state={state} setState={setState} />}
            <Lock state={state} setState={setState} />
        </div>
    );
};

export default EditContainer;
