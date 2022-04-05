import {render} from "@testing-library/react";
import {LoaderModes} from "@axa-fr/react-toolkit-all";
import ItemsTable from "./ItemsTable";

const items = [{
    id: "0001",
    name: "Carte verte",
    groupName: "groupName",
    annotationType: "Image",
    numberTagToDo: 300,
    createDate: new Date("10-30-2019").getTime()
}];

const filters = {
    paging: {
        numberItemsByPage: 10,
            currentPage: 1,
    },
    filterValue: null,
        columns: {
        name: { value: null, timeLastUpdate: null },
        groupName: {value: null, timeLastUpdate: null},
        createDate: { value: 'desc', timeLastUpdate: new Date() },
        annotationType: { value: null, timeLastUpdate: null },
        numberTagToDo: { value: null, timeLastUpdate: null },
        numberCrossAnnotation: {value: null}
    },
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetch = async (url, config) => {
    await sleep(1);
            return {
                status: 201,
                json: async () => {
                    await sleep(1);
                    return {};
                }
            };
};

describe("Check Project ItemsTable behaviour", () => {
    
    test("Chould render correctly", async () => {
        const {asFragment} = render(<ItemsTable items={items} filters={filters} loaderMode={LoaderModes.none} onChangePaging={() => {}} onChangeSort={() => {}} fetch={fetch}/>);
        expect(asFragment()).toMatchSnapshot();
    })
    
})