import React from 'react';
import Table from '@axa-fr/react-toolkit-table';

export const Overview = ({ project, dataset, group }) => {
  const labels = project.labels && project.labels.length > 0 ? project.labels : [];
  const percentAdvancement = ((100 * (dataset.numberFiles - project.numberTagToDo)) / dataset.numberFiles).toFixed(2);

  return (
    <>
      <h2>Informations générales</h2>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Labels</Table.Th>
            <Table.Th>Users</Table.Th>
            <Table.Th>Tags restant</Table.Th>
            <Table.Th>Pourcentage d&apos;avancement</Table.Th>
            <Table.Th>Date de création</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          <Table.Tr>
            <Table.Td>{labels.length}</Table.Td>
            <Table.Td>{group && group.users ? group.users.length : 0}</Table.Td>
            <Table.Td>{project.numberTagToDo}</Table.Td>
            <Table.Td>{percentAdvancement}%</Table.Td>
            <Table.Td>{project.createDate}</Table.Td>
          </Table.Tr>
        </Table.Body>
      </Table>
    </>
  );
};

export default Overview;
