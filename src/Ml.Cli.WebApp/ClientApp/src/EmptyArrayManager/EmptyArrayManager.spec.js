import EmptyArrayManager from "./index";
import {render, waitFor} from '@testing-library/react';

describe("Check EmptyArrayManager behaviour", () => {
    test("Should render children correctly when items list is not empty", async () => {
        const {getAllByText, asFragment} = render(<EmptyArrayManager items={["test"]} emptyArrayMessage="No elements found"><p>Test</p></EmptyArrayManager>);
        await waitFor(() => expect(getAllByText(/Test/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
    test("Should not render children if items list is empty", async () => {
        const {getAllByText, asFragment} = render(<EmptyArrayManager items={[]} emptyArrayMessage="No elements found"><p>Test</p></EmptyArrayManager>);
        await waitFor(() => expect(getAllByText(/elements/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
})