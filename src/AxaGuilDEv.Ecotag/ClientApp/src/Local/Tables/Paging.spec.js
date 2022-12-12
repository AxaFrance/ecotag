import {computeNumberPages, filterPaging} from "./Paging";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('Check paging filter', () => {

    test('Should compute correct number of pages', () => {
        const result = computeNumberPages(items, 5);
        expect(result).toEqual(2);
    });

    test('Should return correct items and page number', () => {
        let result = filterPaging(items, 5, 1);
        expect(result.items).toEqual([1, 2, 3, 4, 5]);
        result = filterPaging(items, 5, 2);
        expect(result.items).toEqual([6, 7, 8, 9, 10]);
    });
});