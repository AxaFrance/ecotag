import StatsTable, {computeTotalTimeMs, orderByStatusCode} from './StatsTable';
import {render} from "@testing-library/react";
import React from "react";
import {fireEvent} from "@testing-library/dom";

const items = [
    {
        left: {
            TimeMs: 0,
            StatusCode: 200
        },
        right: {
            TimeMs: 2,
            StatusCode: 200
        }
    },
    {
        left: {
            TimeMs: 0,
            StatusCode: 200
        },
        right: {
            TimeMs: 8,
            StatusCode: 500
        }
    }
]

const dataSource = ("");

describe("Check items score handling", () => {

    test('Compute total time of items', () => {
        const result = computeTotalTimeMs(items);
        expect(result.leftTimeMs).toStrictEqual(0);
        expect(result.rightTimeMs).toStrictEqual(10);
    });

    test('Check order by status code', () => {
        const result = orderByStatusCode(items);
        expect(result).toStrictEqual({
            "200": {
                "left": 2,
                "right": 1
            },
            "500": {
                "left": 0,
                "right": 1
            }
        });
    });

    test('Check errors removal', () => {
        const mockedState = {isStatsTableShowed: true};
        const setMockedState = () => console.log("Test");
        const items = [{
            "left": {"StatusCode": 200, "TimeMs": 5000, "Body": "[FileBody_Correct_Left]"},
            "right": {"StatusCode": 200, "TimeMs": 0, "Body": "[FileBody_Correct_Right]"}
        }, {
            "left": {"StatusCode": 504, "TimeMs": 5000, "Body": "[FileBody_Incorrect_Left]"},
            "right": {"StatusCode": 200, "TimeMs": 0, "Body": "[FileBody_Incorrect_Right]"}
        }];

        const {getByLabelText, queryAllByText} = render(<StatsTable state={mockedState} setState={setMockedState}
                                                                    items={items}/>);
        const checkbox = getByLabelText('Remove errors from stats:');

        expect(queryAllByText(/10/i)).not.toBeNull();

        fireEvent.click(checkbox);

        expect(queryAllByText(/10/i)).toEqual([]);
        expect(queryAllByText(/5/i)).not.toBeNull();
    });
});