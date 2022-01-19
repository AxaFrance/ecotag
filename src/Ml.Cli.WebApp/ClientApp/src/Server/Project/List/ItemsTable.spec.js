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
    filterValue: null,
        columns: {
        name: { value: null, timeLastUpdate: null },
        classification: { value: null, timeLastUpdate: null },
        createDate: { value: 'desc', timeLastUpdate: new Date() },
        typeAnnotation: { value: null, timeLastUpdate: null },
        numberTagToDo: { value: null, timeLastUpdate: null },
    },
};

describe("Check Project ItemsTable behaviour", () => {
    
    test("Chould render correctly", async () => {
        const {container, getAllByText, asFragment} = render(<ItemsTable items={items} filters={filters} loaderMode={LoaderModes.none} onChangePaging={() => {}} onChangeSort={() => {}} onDeleteProject={() => {}}/>);

        expect(asFragment()).toMatchSnapshot();
        
        const deleteProjectButton = container.querySelector("#removeActionId");
        
        fireEvent.click(deleteProjectButton);
        
        await waitFor(() => expect(getAllByText(/Confirmer la suppression du projet/i)).not.toBeNull());
    })
    
})