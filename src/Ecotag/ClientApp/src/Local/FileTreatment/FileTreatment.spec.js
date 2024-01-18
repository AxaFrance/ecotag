import {compareStatusCode, mapItems, setStatusFilterItems,} from './FileTreatment';

describe('Check file treatment', () => {
    it('should map items properly', () => {
        const data = [
            {
                FileName: "MyFirstFileName.txt",
                Left: {
                    Url: "http://localhost:5000",
                    FileName: "MyFirstFileName.txt",
                    FileDirectory: "folder1",
                    ImageDirectory: "folder2",
                    FrontDefaultStringsMatcher: "",
                    StatusCode: 200,
                    Body: "Blah blah blah",
                    Headers: "",
                    TimeMs: 4000,
                    TicksAt: 0
                },
                Right: {
                    Url: "http://localhost:5000",
                    FileName: "MyFirstFileName.txt",
                    FileDirectory: "folder1",
                    ImageDirectory: "folder2",
                    FrontDefaultStringsMatcher: "",
                    StatusCode: 400,
                    Body: "Blah blah blah",
                    Headers: "",
                    TimeMs: 4000,
                    TicksAt: 0
                }
            },
            undefined,
            {
                FileName: "MySecondFileName.txt",
                Left: {
                    Url: "http://localhost:5000",
                    FileName: "MySecondFileName.txt",
                    FileDirectory: "folder1",
                    ImageDirectory: "folder2",
                    FrontDefaultStringsMatcher: "",
                    StatusCode: 200,
                    Body: "Blah blah blah",
                    Headers: "",
                    TimeMs: 4000,
                    TicksAt: 0
                },
                Right: {
                    Url: "http://localhost:5000",
                    FileName: "MySecondFileName.txt",
                    FileDirectory: "folder1",
                    ImageDirectory: "folder2",
                    FrontDefaultStringsMatcher: "",
                    StatusCode: 400,
                    Body: "Blah blah blah",
                    Headers: "",
                    TimeMs: 4000,
                    TicksAt: 0
                }
            },
            null
        ];
        const mappedData = mapItems(data);
        expect(mappedData.length).toEqual(2);
        for(let item in mappedData){
            expect(item).not.toBeUndefined();
            expect(item).not.toBeNull();
        }
    });
    it('should add new status code properly', () => {
        const statusCode = 200;
        const result = [{value: "All", label: "All"}];
        compareStatusCode(statusCode, result);

        expect(result.length).toEqual(2);
        expect(result[0]).toEqual({value: "All", label: "All"});
        expect(result[1]).toEqual({value: "200", label: "200"});
    });
    it('should set status filter items properly', () => {
        const items = [
            {
                left: {
                    StatusCode: 200
                },
                right: {
                    StatusCode: 200
                }
            },
            {
                left: {
                    StatusCode: 200
                },
                right: {
                    StatusCode: 400
                }
            }
        ];
        const newFilters = setStatusFilterItems(items);

        expect(newFilters.length).toEqual(3);
        expect(newFilters[0]).toEqual({value: "All", label: "All"});
        expect(newFilters[1]).toEqual({value: "200", label: "200"});
        expect(newFilters[2]).toEqual({value: "400", label: "400"});
    });
});
