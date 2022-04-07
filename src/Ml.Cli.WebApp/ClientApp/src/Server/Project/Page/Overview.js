import React from 'react';
import {
  ArticleRestitution,
  SectionRestitution,
  SectionRestitutionColumn,
  SectionRestitutionRow,
  Restitution,
  HeaderRestitution
} from '@axa-fr/react-toolkit-restitution';
import {formatTimestampToString} from "../../date";

export const Overview = ({ project, dataset, group, annotationsStatus, users= [] }) => {

  const groupEmails = group.userIds.map(userId => {
    const user = users.find(user => user.id === userId);
    if(user == null){
      return "";
    }
    return user.email;
  })
  
  return (
    <>
      <ArticleRestitution>
        <HeaderRestitution
            title="Informations générales"
        />
        <SectionRestitution>
          <SectionRestitutionRow >
            <SectionRestitutionColumn>
              <Restitution label="Nom" value={project.name} />
              <Restitution label="Type d'annotation" value={project.annotationType} />
              <Restitution label="Date de création" value={formatTimestampToString(project.createDate)} />
              <Restitution label="Nombre de fichier" value={dataset.files.length} />
              <Restitution label="Nombre annotation croisée" value={project.numberCrossAnnotation} />
              <Restitution label="Avancement annotations" value={annotationsStatus ? `${annotationsStatus.percentageNumberAnnotationsDone}%` : '0%'} />
            </SectionRestitutionColumn>
            <SectionRestitutionColumn>
              <Restitution label="Dataset" value={dataset.name} />
              <Restitution label="Type de dataset" value={dataset.type} />
              <Restitution label="Groupe annotateurs" value={group.name} />
              <Restitution label="Emails du groupe" values={groupEmails} />
            </SectionRestitutionColumn>
          </SectionRestitutionRow>
        </SectionRestitution>
      </ArticleRestitution>    

    </>
  );
};

export default Overview;
