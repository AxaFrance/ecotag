import React from 'react';
import Overview from './Overview';
import Label from './LabelsList';
import Users from './Users';
import Title from '../../../TitleBar';
import ActionBar from './ActionBar';
import './Page.scss';
import Lock from "../../shared/Lock/Lock";

const Page = ({ project, dataset, users, group, annotationsStatus, onExport, user }) => (
  <div className="ft-project-page">
    <Title title={project.name} subtitle={`Project de type ${project.annotationType}`} goTo={"/projects"} goTitle={"Projets"} />
    <ActionBar user={user} projectId={project.id} projectName={project.name} isAnnotationClosed={annotationsStatus == null ? true :  annotationsStatus.isAnnotationClosed} onExport={onExport} />
    <div className="ft-project-page__informationsContainer">
      <Overview project={project} dataset={dataset} group={group} users={users} annotationsStatus={annotationsStatus}  />
      <div className="ft-rowLabelDataset">
          <Label labels={project.labels && project.labels.length > 0 ? project.labels : []} />
          <Users users={users} numberAnnotationsByUsers={annotationsStatus == null ? [] : annotationsStatus.numberAnnotationsByUsers} />
      </div>
    </div>
    <Lock 
        isLocked={isLocked}
        onLockAction={onLockAction}
        text="Clôturer"
        lockedText="Projet fermé"
        isDisabled={isDisabled}
    />
  </div>
);

export default Page;
