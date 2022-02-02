import React, {useState} from 'react';
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import Lock from "./Lock";
import ConfirmModal from "./ConfirmModal";
import './Edit.scss';
import Title from "../../../TitleBar";
import {computeNumberPages, filterPaging} from "../../shared/filtersUtils";
import {fetchDataset, fetchLockDataset} from "../Dataset.service";
import {resilienceStatus, withResilience} from "../../shared/Resilience";
import {useParams} from "react-router-dom";
import withCustomFetch from "../../withCustomFetch";
import {convertStringDateToDateObject} from "../../date";


export const init = (fetch, setState) => async (id, state) => {
    const response = await fetchDataset(fetch)(id);
    let data;
    if(response.status >= 500) {
        data = { status: resilienceStatus.ERROR };
    } else {
        const dataset = await response.json()
        const datasetData = convertStringDateToDateObject({ name: dataset.name, 
            id: dataset.id, 
            createDate: dataset.createDate,
            isLock: dataset.isLocked,
            type: dataset.type
        });
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

export const Edit = ({fetch, state, setState, lock}) => <div className="edit-dataset">
    <ConfirmModal isOpen={state.openLockModal} onCancel={lock.onCancel} onSubmit={lock.onSubmit}/>
    <Title title={state.dataset.name} subtitle="Edition du dataset" goTo="/datasets" goTitle="Datasets" />
    <FileUpload fetch={fetch} state={state} setState={setState}/>
    {state.files.filesSend.length === 0 ? null : <FileList state={state} setState={setState} />}
    <Lock state={state} onLockDataset={lock.onLockDataset} />
</div>

const PageWithResilience = withResilience(Edit);

export const EditContainer = ({fetch}) => {
    const { id } = useParams();
    const [state, setState] = useState({
        dataset: { name: "", id: "", createDate:null, isLock:false },
        status: resilienceStatus.LOADING,
        files:{
            filesLoad: [],
            filesSend: [],
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
