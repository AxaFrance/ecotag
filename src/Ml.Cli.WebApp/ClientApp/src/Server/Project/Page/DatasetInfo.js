import React from 'react';
import Table from '@axa-fr/react-toolkit-table';

export const DatasetInfo = ({ dataset }) => {
  return (
    <div>
      <h2>Dataset</h2>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Classification</Table.Th>
            <Table.Th>Nb fichier</Table.Th>
            <Table.Th>Date de création</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          <Table.Tr>
            <Table.Td>{dataset.name}</Table.Td>
            <Table.Td>{dataset.type}</Table.Td>
            <Table.Td>{dataset.classification}</Table.Td>
            <Table.Td>{dataset.numberFiles}</Table.Td>
            <Table.Td>{dataset.createDate}</Table.Td>
          </Table.Tr>
        </Table.Body>
      </Table>
    </div>
  );
};

export default DatasetInfo;
