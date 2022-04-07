import React from 'react';
import Table from '@axa-fr/react-toolkit-table';
import EmptyArrayManager from "../../../EmptyArrayManager";

const UserLine = ({users, annotationUser}) =>{
    const user = users.find(user => user.subject.toLowerCase() === annotationUser.nameIdentifier.toLowerCase())
    if(!annotationUser || !user){
        return null;
    }
   
   return (<Table.Tr key={user.id}>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{annotationUser.numberAnnotations}</Table.Td>
    </Table.Tr>);
}

export const UserAnnotationsStatus = ({ users = [], numberAnnotationsByUsers=[] }) => {
  return (
    <div>
      <h2>Annotations</h2>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Emails</Table.Th>
            <Table.Th>Nombre d&apos;annotations</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
            <EmptyArrayManager items={numberAnnotationsByUsers} emptyArrayMessage="Il n'y a pas d'annotation sur ce projet pour l'instant.">
                {numberAnnotationsByUsers.map(annotationUser => (
                    <UserLine users={users} annotationUser={annotationUser} />
                ))}
            </EmptyArrayManager>
        </Table.Body>
      </Table>
    </div>
  );
};

export default UserAnnotationsStatus;
