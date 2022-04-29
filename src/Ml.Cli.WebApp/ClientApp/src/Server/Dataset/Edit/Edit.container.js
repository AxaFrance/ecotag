import React, {useState} from 'react';
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import './Edit.scss';
import Title from "../../../TitleBar";
import {computeNumberPages, filterPaging} from "../../shared/filtersUtils";
import {fetchDataset, fetchLockDataset} from "../Dataset.service";
import {resilienceStatus, withResilience} from "../../shared/Resilience";
import {useParams} from "react-router-dom";
import withCustomFetch from "../../withCustomFetch";
import Lock from "../../shared/Lock/Lock";
import ConfirmModal from "../../shared/ConfirmModal/ConfirmModal";

export const init = (fetch, setState) => async (id, state) => {
    const response = await fetchDataset(fetch)(id);
    let data;
    if(response.status >= 500) {
        data = { status: resilienceStatus.ERROR };
    } else {
        const dataset = await response.json()
        const datasetData = { name: dataset.name, 
            id: dataset.id, 
            createDate: dataset.createDate,
            isLock: dataset.isLocked,
            type: dataset.type
        };
        const filesSend= dataset.files.map( f => { return  { file: { id: f.id, type: f.contentType, size: f.size, name: f.fileName } }})
        data = { status: resilienceStatus.SUCCESS, dataset:datasetData, files : {...state.files, filesSend} };
    }
    setState({ ...state, ...data});
};

const lockDataset = (fetch, setState) => async (state, idDataset) => {
    const response = await fetchLockDataset(fetch)(idDataset);
    let data;
    if (response.status >= 500) {
        data = {status: resilienceStatus.ERROR};
    } else {
        data = {status: resilienceStatus.SUCCESS};
    }
    setState({...state, ...data, openLockModal: false, dataset: {...state.dataset, isLock:true }});
};

export const Edit = ({fetch, state, setState, lock}) => {
    const isDisabled = state.files.filesSend.length === 0;
    return(
        <div className="edit-dataset">
            <ConfirmModal title='Voulez-vous verrouiller le dataset définitivement ?' isOpen={state.openLockModal} onCancel={lock.onCancel} onSubmit={lock.onSubmit}>
                <p className="edit-dataset__modal-core-text">
                    Cette action est définitive. <br />
                    Toute modification (ajout, supression de fichier) sera impossible par la suite.
                </p>
            </ConfirmModal>
            <Title title={state.dataset.name} subtitle="Edition du dataset" goTo="/datasets" goTitle="Datasets"/>
            <FileUpload fetch={fetch} state={state} setState={setState}/>
            {state.files.filesSend.length === 0 ? null : <FileList fetch={fetch} state={state} setState={setState}/>}
            <Lock text="Verrouiller" lockedText="Dataset verrouillé" isDisabled={isDisabled} isLocked={state.dataset.isLock} onLockAction={lock.onLockDataset}/>
        </div>
    );
}

const PageWithResilience = withResilience(Edit);

export const EditContainer = ({fetch}) => {
    const { id } = useParams();
    const [state, setState] = useState({
        dataset: { name: "", id: "", createDate:null, isLock:false },
        status: resilienceStatus.LOADING,
        files:{
            filesLoad: { values : [] },
            filesLoadError: [],
            filesSend: [],
            filesSendError: [],
            paging: {
                numberPages: computeNumberPages([], 10),
                currentPages: 1,
                itemByPages: 5,
                itemFiltered: filterPaging([], 10, 1)
            }
        },
        openLockModal: false,
    });

    
    const lock = {
        onLockDataset: () =>{
            if(state.dataset.isLock){
                return;
            }
            setState({...state, openLockModal: true});
        },
        onCancel : () => {
            setState({...state, openLockModal: false});
        },

        onSubmit : () => {
            lockDataset(fetch, setState)(state, id)
        }
    }

    React.useEffect(() => {
        init(fetch, setState)(id, state);
    }, []);

    return <PageWithResilience fetch={fetch} status={state.status} state={state} setState={setState} lock={lock} />;
};

export default withCustomFetch(fetch)(EditContainer);
