import React from 'react';
import Table from '@axa-fr/react-toolkit-table';

export const Label = ({ labels }) => {
  return (
    <div className="ft-labels">
      <h2>Labels</h2>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Couleur</Table.Th>
            <Table.Th>Id</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {labels.map((label, index) => (
            <Table.Tr key={index}>
              <Table.Td>{label.name}</Table.Td>
              <Table.Td>
                <div className="ft-labels__table-td-color">
                  <span>{label.color}</span>
                  <div style={{ backgroundColor: label.color }} className="ft-labels__label-color"></div>
                </div>
              </Table.Td>
              <Table.Td>{label.id}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Label;
