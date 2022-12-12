import React from 'react';
import Overview from './Overview';
import Label from './LabelsList';
import Users from './Users';
import Title from '../../../TitleBar';
import ActionBar from './ActionBar';
import './Page.scss';
import Lock from "../../shared/Lock/Lock";
import ConfirmModal from "../../shared/ConfirmModal/ConfirmModal";
import {DataScientist} from "../../withAuthentication";

const Page = ({project, dataset, users, group, annotationsStatus, isModalOpened, onExport, user, lock}) => (
    <div className="ft-project-page">
        <ConfirmModal title="Voulez-vous clôturer le projet définitivement ?" isOpen={isModalOpened}
                      onCancel={lock.onCancel} onSubmit={lock.onSubmit}>
            <p className="ft-project-page__modal-core-text">
                Cette action est définitive. <br/>
                Le projet n'existera plus. <br/>
                Le dataset associé sera supprimé s'il n'est pas associé à d'autres projets.
            </p>
        </ConfirmModal>
        <Title title={project.name} subtitle={`Project de type ${project.annotationType}`} goTo={"/projects"}
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
                text="Clôturer"
                lockedText="Projet fermé"
                isDisabled={false}
            />
        }
    </div>
);

export default Page;
