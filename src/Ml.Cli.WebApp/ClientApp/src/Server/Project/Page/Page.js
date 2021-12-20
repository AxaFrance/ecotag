import React from 'react';
import Overview from './Overview';
import Label from './LabelsList';
import DatasetInfo from './DatasetInfo';
import Users from './Users';
import Title from '../../shared/Title';
import ActionBar from './ActionBar';
import './Page.scss';

const Page = ({ project, dataset, user, group }) => (
  <div className="ft-project-page">
    <Title backHome>
      {project.name}
      <span className="ft-project-page__type-annotation">{project.typeAnnotation}</span>
    </Title>
    <ActionBar project={project} dataset={dataset} currentUser={user} />
    <div className="ft-project-page__informationsContainer">
      <Overview project={project} dataset={dataset} />
      <div className="ft-rowLabelDataset">
        <Label labels={project.labels && project.labels.length > 0 ? project.labels : []} />
        <DatasetInfo dataset={dataset} />
      </div>
      <Users users={group.users && group.users.length > 0 ? group.users : []} />
    </div>
  </div>
);

export default Page;
