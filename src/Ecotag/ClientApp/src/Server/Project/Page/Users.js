import React from 'react';
import Table from '@axa-fr/react-toolkit-table';
import EmptyArrayManager from '../../../EmptyArrayManager';
import useProjectTranslation from '../../../translations/useProjectTranslation';

const UserLine = ({users, annotationUser}) => {
    const user = users.find(user => user.nameIdentifier.toLowerCase() === annotationUser.nameIdentifier.toLowerCase())
    if (!annotationUser || !user) {
        return null;
    }

    return (<Table.Tr key={user.id}>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{annotationUser.numberAnnotations}</Table.Td>
    </Table.Tr>);
}

export const UserAnnotationsStatus = ({users = [], numberAnnotationsByUsers = []}) => {
    const {translate} = useProjectTranslation();
    return (
        <div>
            <h2>{translate('project.project_page.users.title')}</h2>
            <EmptyArrayManager items={numberAnnotationsByUsers}
                               emptyArrayMessage={translate('project.project_page.users.no_annotations')}>
                <Table>
                    <Table.Header>
                        <Table.Tr>
                            <Table.Th>{translate('project.project_page.users.headers.emails')}</Table.Th>
                            <Table.Th>{translate('project.project_page.users.headers.nb_annotations')}</Table.Th>
                        </Table.Tr>
                    </Table.Header>
                    <Table.Body>
                        {numberAnnotationsByUsers.map(annotationUser => (
                            <UserLine users={users} annotationUser={annotationUser}/>
                        ))}
                    </Table.Body>
                </Table>
            </EmptyArrayManager>
        </div>
    );
};

export default UserAnnotationsStatus;
