import {render, fireEvent, waitFor} from "@testing-library/react";
import {LoaderModes} from "@axa-fr/react-toolkit-all";
import ItemsTable from "./ItemsTable";

const items = [{
    id: "0001",
    name: "Carte verte",
    type: "Image",
    classification: "Publique",
    numberFiles: 300,
    createDate: "30/10/2019"
}];

const filters = {
    paging: {
        numberItemsByPage: 10,
        currentPage: 1,
    },
    columns: {
        name: {
            value: 1
        },
        classification: {
            value: 2
        },
        numberFiles: {
            value: 3
        },
        createDate: {
            value: 4
        }
    }
};

describe("Check Group ItemsTable behaviour", () => {
    
    test("Should render correctly and display users modification and group deletion modals", async () => {
        const {container, queryByText, getAllByText, getByText, asFragment} = render(<ItemsTable items={items} filters={filters} loaderMode={LoaderModes.none} onChangePaging={() => {}} onDeleteGroup={() => {}} onUpdateUser={() => {}}/>);

        expect(asFragment()).toMatchSnapshot();
        
        const manageUserButton = container.querySelector("#editActionId");
        
        fireEvent.click(manageUserButton);
        
        await waitFor(() => expect(getAllByText(/Ajouter\/Supprimer des utilisateurs à ce groupe/i)).not.toBeNull());
        
        const quitModalButton = getByText(/Annuler/i);
        
        fireEvent.click(quitModalButton);
        
        await waitFor(() => expect(queryByText(/Annuler/i)).toBeNull());
        
        const deleteGroupButton = container.querySelector("#removeActionId");
        
        fireEvent.click(deleteGroupButton);
        
        await waitFor(() => expect(getAllByText(/Confirmer la suppression de groupe/i)).not.toBeNull());
    })
    
})