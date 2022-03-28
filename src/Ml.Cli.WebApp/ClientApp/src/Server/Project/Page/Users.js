import React from 'react';
import Table from '@axa-fr/react-toolkit-table';

const getNumberAnnotationsByUsers = (numberAnnotationsByUsers, nameIdentifier) =>{
    
    if(!numberAnnotationsByUsers){
        return 0;
    }
    
    const numberAnnotationsByUser = numberAnnotationsByUsers.find(n => n.nameIdentifier.toLowerCase() === nameIdentifier.toLowerCase());
    if(numberAnnotationsByUser){
        return numberAnnotationsByUser.numberAnnotations;
    }
    return 0;
}


const UserLine = ({user, numberAnnotationsByUsers}) =>{
    if(!user){
        return null;
    }
   return (<Table.Tr key={user.id}>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{getNumberAnnotationsByUsers(numberAnnotationsByUsers, user.subject)}</Table.Td>
    </Table.Tr>);
}

export const User = ({ group = {userIds :[]}, users = [], numberAnnotationsByUsers=[] }) => {
  return (
    <div>
      <h2>Annotateurs</h2>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Adresse e-mail</Table.Th>
            <Table.Th>Nombre d&apos;annotations</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {group.userIds.map((userId, index) => (
              <UserLine user={users.find(user => user.id === userId)} numberAnnotationsByUsers={numberAnnotationsByUsers} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default User;
