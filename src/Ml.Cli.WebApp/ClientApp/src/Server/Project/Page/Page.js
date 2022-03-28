import React from 'react';
import Overview from './Overview';
import Label from './LabelsList';
import Users from './Users';
import Title from '../../../TitleBar';
import ActionBar from './ActionBar';
import './Page.scss';

const Page = ({ project, dataset, users, group }) => (
  <div className="ft-project-page">
    <Title title={project.name} subtitle={`Project de type ${project.annotationType}`} goTo={"/projects"} goTitle={"Projets"} />
    <ActionBar project={project} />
    <div className="ft-project-page__informationsContainer">
      <Overview project={project} dataset={dataset} group={group}  />
      <div className="ft-rowLabelDataset">
          <Label labels={project.labels && project.labels.length > 0 ? project.labels : []} />
          <Users group={group} users={users} />
      </div>
      
    </div>
  </div>
);

export default Page;
