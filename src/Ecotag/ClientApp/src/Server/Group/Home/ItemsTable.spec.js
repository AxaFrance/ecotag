import {fireEvent, render, waitFor} from "@testing-library/react";
import {LoaderModes} from "@axa-fr/react-toolkit-all";
import ItemsTable from "./ItemsTable";

const items = [{
    id: "0001",
    name: "Carte verte",
    type: "Image",
    classification: "Publique",
    numberFiles: 300,
    createDate: new Date("10-30-2019").getTime()
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
        const {container, queryByText, getAllByText, getByText, asFragment} = render(<ItemsTable items={items}
                                                                                                 filters={filters}
                                                                                                 loaderMode={LoaderModes.none}
                                                                                                 onChangePaging={() => {
                                                                                                 }}
                                                                                                 onUpdateUser={() => {
                                                                                                 }}/>);

        expect(asFragment()).toMatchSnapshot();

        const manageUserButton = container.querySelector("#editActionId");

        fireEvent.click(manageUserButton);

        await waitFor(() => expect(getAllByText(/Add\/Remove users from this team/i)).not.toBeNull());

        const quitModalButton = getByText(/Cancel/i);

        fireEvent.click(quitModalButton);

        await waitFor(() => expect(queryByText(/Cancel/i)).toBeNull());
    })

})