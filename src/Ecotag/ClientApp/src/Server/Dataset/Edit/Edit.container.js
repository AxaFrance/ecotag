import React, {useState} from 'react';
import FileUpload from './FileUpload';
import FileList from './FileList';
import './Edit.scss';
import Title from '../../../TitleBar';
import {computeNumberPages, filterPaging} from '../../shared/filtersUtils';
import {fetchDataset, fetchLockDataset, Locked} from '../Dataset.service';
import {resilienceStatus, withResilience} from '../../shared/Resilience';
import {useParams} from 'react-router-dom';
import withCustomFetch from '../../withCustomFetch';
import Lock from '../../shared/Lock/Lock';
import ConfirmModal from '../../shared/ConfirmModal/ConfirmModal';
import useProjectTranslation from '../../../translations/useProjectTranslation';

export const init = (fetch, setState) => async (id, state) => {
    const response = await fetchDataset(fetch)(id);
    let data;
    if (response.status >= 500 || response.status === 403) {
        data = {status: response.status === 403 ? resilienceStatus.FORBIDDEN : resilienceStatus.ERROR};
    } else {
        const dataset = await response.json()
        const datasetData = {
            name: dataset.name,
            id: dataset.id,
            createDate: dataset.createDate,
            locked: dataset.locked,
            type: dataset.type
        };
        const filesSend = dataset.files.map(f => {
            return {file: {id: f.id, type: f.contentType, size: f.size, name: f.fileName}}
        })
        data = {status: resilienceStatus.SUCCESS, dataset: datasetData, files: {...state.files, filesSend}};
    }
    setState({...state, ...data});
};

const lockDataset = (fetch, setState) => async (state, idDataset) => {
    const response = await fetchLockDataset(fetch)(idDataset);
    let data;
    if (response.status >= 500 || response.status === 403) {
        data = {status: response.status === 403 ? resilienceStatus.FORBIDDEN : resilienceStatus.ERROR};
    } else {
        data = {status: resilienceStatus.SUCCESS};
    }
    setState({...state, ...data, openLockModal: false, dataset: {...state.dataset, locked: Locked.Locked}});
};

export const Edit = ({fetch, state, setState, lock}) => {
    const {translate} = useProjectTranslation();
    const isDisabled = state.files.filesSend.length === 0;

    const lockedText = (locked) => {
        switch (locked) {
            case Locked.Locked:
                return translate('dataset.edit.locked_state.locked');
            case Locked.LockedAndWorkInProgress:
                return translate('dataset.edit.locked_state.locked_and_work_in_progress');
            default:
                return translate('dataset.edit.locked_state.default');
        }
    };

    return (
        <div className="edit-dataset">
            <ConfirmModal title={translate('dataset.edit.confirm_modal.title')} isOpen={state.openLockModal}
                          onCancel={lock.onCancel} onSubmit={lock.onSubmit}>
                <p className="edit-dataset__modal-core-text">
                    {translate('dataset.edit.confirm_modal.warning_first_part')}<br/>
                    {translate('dataset.edit.confirm_modal.warning_second_part')}
                </p>
            </ConfirmModal>
            <Title title={state.dataset.name} subtitle={translate('dataset.edit.subtitle')} goTo="/datasets" goTitle="Datasets"/>
            <FileUpload fetch={fetch} state={state} setState={setState}/>
            {state.files.filesSend.length === 0 ? null : <FileList fetch={fetch} state={state} setState={setState}/>}
            <Lock text={translate('dataset.edit.lock')} lockedText={lockedText(state.dataset.locked)} isDisabled={isDisabled}
                  isLocked={state.dataset.locked !== Locked.None} onLockAction={lock.onLockDataset}/>
        </div>
    );
}

const PageWithResilience = withResilience(Edit);

export const EditContainer = ({fetch}) => {
    const {id} = useParams();
    const [state, setState] = useState({
        dataset: {name: "", id: "", createDate: null, locked: Locked.None},
        status: resilienceStatus.LOADING,
        files: {
            filesLoad: {values: []},
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
        onLockDataset: () => {
            if (state.dataset.locked !== Locked.None) {
                return;
            }
            setState({...state, openLockModal: true});
        },
        onCancel: () => {
            setState({...state, openLockModal: false});
        },

        onSubmit: () => {
            lockDataset(fetch, setState)(state, id)
        }
    }

    React.useEffect(() => {
        init(fetch, setState)(id, state);
    }, []);

    return <PageWithResilience fetch={fetch} status={state.status} state={state} setState={setState} lock={lock}/>;
};

export default withCustomFetch(fetch)(EditContainer);
