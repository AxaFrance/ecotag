import React from 'react';
import {
  ArticleRestitution,
  SectionRestitution,
  SectionRestitutionColumn,
  SectionRestitutionRow,
  Restitution,
  HeaderRestitution
} from '@axa-fr/react-toolkit-restitution';
export const Overview = ({ project, dataset, group }) => {
  //const labels = project.labels && project.labels.length > 0 ? project.labels : [];
  //const percentAdvancement = ((100 * (dataset.numberFiles - project.numberTagToDo)) / dataset.numberFiles).toFixed(2);

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
              <Restitution label="Type d'annotation" value={project.typeAnnotation} />
              <Restitution label="Date de création" value={project.createDate.toString()} />
              <Restitution label="Nombre de fichier" value={dataset.files.length} />
              <Restitution label="Tags restant" value={project.numberTagToDo} />
              <Restitution label="Pourcentage d&apos;avancement" value="100%" />
            </SectionRestitutionColumn>
            <SectionRestitutionColumn>
              <Restitution label="Dataset" value={dataset.name} />
              <Restitution label="Type de dataset" value={dataset.type} />
              <Restitution label="Classification" value={dataset.classification} />
              <Restitution label="Groupe annotateurs" value={group.name} />
            </SectionRestitutionColumn>
          </SectionRestitutionRow>
        </SectionRestitution>
      </ArticleRestitution>    

    </>
  );
};

export default Overview;
