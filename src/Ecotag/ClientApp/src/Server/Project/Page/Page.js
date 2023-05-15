import React from 'react';
import Overview from './Overview';
import Label from './LabelsList';
import Users from './Users';
import Title from '../../../TitleBar';
import ActionBar from './ActionBar';
import './Page.scss';
import Lock from '../../shared/Lock/Lock';
import ConfirmModal from '../../shared/ConfirmModal/ConfirmModal';
import {DataScientist} from '../../withAuthentication';
import useProjectTranslation from '../../../useProjectTranslation';

const Page = ({project, dataset, users, group, annotationsStatus, isModalOpened, onExport, user, lock}) => {
    const {translate} = useProjectTranslation();

    return(
        <div className="ft-project-page">
            <ConfirmModal title={translate('project.project_page.confirmation_modal.title')} isOpen={isModalOpened}
                          onCancel={lock.onCancel} onSubmit={lock.onSubmit}>
                <p className="ft-project-page__modal-core-text">
                    {translate('project.project_page.confirmation_modal.description_first_part')}<br/>
                    {translate('project.project_page.confirmation_modal.description_second_part')}<br/>
                    {translate('project.project_page.confirmation_modal.description_third_part')}
                </p>
            </ConfirmModal>
            <Title title={project.name} subtitle={`${translate('project.project_page.subtitle')} ${project.annotationType}`} goTo={"/projects"}
                   goTitle={"Projets"}/>
            <ActionBar user={user} projectId={project.id} projectName={project.name}
                       isAnnotationClosed={annotationsStatus == null ? true : annotationsStatus.isAnnotationClosed}
                       onExport={onExport}/>
            <div className="ft-project-page__informationsContainer">
                <Overview project={project} dataset={dataset} group={group} users={users}
                          annotationsStatus={annotationsStatus}/>
                <div className="ft-rowLabelDataset">
                    <Label labels={project.labels && project.labels.length > 0 ? project.labels : []}/>
                    <Users users={users}
                           numberAnnotationsByUsers={annotationsStatus == null ? [] : annotationsStatus.numberAnnotationsByUsers}/>
                </div>
            </div>
            {user?.roles?.includes(DataScientist) &&
                <Lock
                    isLocked={false}
                    onLockAction={lock.onLockAction}
                    text={translate('project.project_page.lock.text')}
                    lockedText={translate('project.project_page.lock.locked_text')}
                    isDisabled={false}
                />
            }
        </div>
    );
}

export default Page;
