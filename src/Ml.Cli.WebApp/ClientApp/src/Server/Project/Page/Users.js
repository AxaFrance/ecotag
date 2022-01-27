import React from 'react';
import Table from '@axa-fr/react-toolkit-table';

export const User = ({ users = [] }) => {
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
          {users.map((user, index) => (
            <Table.Tr key={index}>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.annotationCounter}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default User;
