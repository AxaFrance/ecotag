import React from 'react';
import Table from '@axa-fr/react-toolkit-table';
import Popover from '@axa-fr/react-toolkit-popover';

export const Label = ({ labels }) => {
  return (
    <div className="ft-labels">
      <h2>Labels</h2>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Couleur</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {labels.map((label, index) => (
            <Table.Tr key={index}>
              <Table.Td>{label.name}</Table.Td>
              <Table.Td>
                <div className="ft-labels__table-td-color">
                    <Popover
                        placement="right"
                        classModifier="color"
                    >
                        <Popover.Pop>
                            <h2>Détails</h2>
                            <p>
                                <span>Id : <b>{label.id}</b></span><br/>
                                <span>Couleur : <b>{label.color}</b></span><br/>
                            </p>
                        </Popover.Pop>
                        <Popover.Over>
                            <div style={{backgroundColor: label.color}} className="ft-labels__label-color"/>
                        </Popover.Over>
                    </Popover>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Label;
