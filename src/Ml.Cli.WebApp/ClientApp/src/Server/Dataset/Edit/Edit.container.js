import React, {useState} from 'react';
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import Lock from "./Lock";
import ConfirmModal from "./ConfirmModal";
import './Edit.scss';
import Title from "../../../TitleBar";
import {computeNumberPages, filterPaging} from "../../shared/filtersUtils";
import {fetchDataset} from "../../Project/Add/New/New.service";
import {resilienceStatus, withResilience} from "../../shared/Resilience";
import {useParams} from "react-router-dom";
import withCustomFetch from "../../withCustomFetch";


export const init = (fetch, setState) => async (id, state) => {
    const response = await fetchDataset(fetch)(id);
    let data;
    if(response.status >= 500) {
        data = { status: resilienceStatus.ERROR };
    } else {
        const dataset = await response.json()
        data = { status: resilienceStatus.SUCCESS, dataset: { name: dataset.name, id: dataset.id} };
    }
    setState({ ...state, ...data});
};

export const Edit = ({state, setState}) => <div className="edit-dataset">
    <ConfirmModal state={state} setState={setState}/>
    <Title title={state.dataset.name} subtitle="Edition du dataset" goTo="/datasets" goTitle="Datasets" />
    <FileUpload state={state} setState={setState}/>
    {state.filesSend.length === 0 ? null : <FileList state={state} setState={setState} />}
    <Lock state={state} setState={setState} />
</div>

const PageWithResilience = withResilience(Edit);

export const EditContainer = ({fetch}) => {
    const { id } = useParams();
    const [state, setState] = useState({
        dataset: { name: "", id: "" },
        status: resilienceStatus.LOADING,
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

    React.useEffect(() => {
        init(fetch, setState)(id, state);
    }, []);

    return <PageWithResilience status={state.status} state={state} setState={setState} />;
};

export default withCustomFetch(fetch)(EditContainer);
