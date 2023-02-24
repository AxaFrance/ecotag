import React from 'react';
import {
    ArticleRestitution,
    HeaderRestitution,
    Restitution,
    SectionRestitution,
    SectionRestitutionColumn,
    SectionRestitutionRow
} from '@axa-fr/react-toolkit-restitution';
import {formatTimestampToString} from "../../date";
import useProjectTranslation from "../../../translations/useProjectTranslation";

export const Overview = ({project, dataset, group, annotationsStatus, users = []}) => {

    const {translate} = useProjectTranslation();

    const groupEmails = group.userIds.map(userId => {
        const user = users.find(user => user.id === userId);
        if (user == null) {
            return "";
        }
        return user.email;
    })

    return (
        <>
            <ArticleRestitution>
                <HeaderRestitution
                    title={translate('project.project_page.overview.title')}
                />
                <SectionRestitution>
                    <SectionRestitutionRow>
                        <SectionRestitutionColumn>
                            <Restitution label={translate('project.project_page.overview.name')} value={project.name}/>
                            <Restitution label={translate('project.project_page.overview.annotation_type')} value={project.annotationType}/>
                            <Restitution label={translate('project.project_page.overview.creation_date')} value={formatTimestampToString(project.createDate)}/>
                            <Restitution label={translate('project.project_page.overview.nb_files')} value={dataset.files.length}/>
                            <Restitution label={translate('project.project_page.overview.nb_cross_annotation')} value={project.numberCrossAnnotation}/>
                            <Restitution label={translate('project.project_page.overview.annotations_progress')}
                                         value={annotationsStatus ? `${annotationsStatus.percentageNumberAnnotationsDone}%` : '0%'}/>
                        </SectionRestitutionColumn>
                        <SectionRestitutionColumn>
                            <Restitution label={translate('project.project_page.overview.dataset')} value={dataset.name}/>
                            <Restitution label={translate('project.project_page.overview.dataset_type')} value={dataset.type}/>
                            <Restitution label={translate('project.project_page.overview.team')} value={group.name}/>
                            <Restitution label={translate('project.project_page.overview.emails')} values={groupEmails}/>
                        </SectionRestitutionColumn>
                    </SectionRestitutionRow>
                </SectionRestitution>
            </ArticleRestitution>
        </>
    );
};

export default Overview;
