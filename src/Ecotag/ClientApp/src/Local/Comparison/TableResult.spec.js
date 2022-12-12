import {filterExtensions, filterStatusCode, sortTime} from "./TableResult";

const files = [
    {
        fileName: "firstFile_jpg.json",
        left: {StatusCode: 200},
        right: {StatusCode: 200}
    },
    {
        fileName: "secondFile_pdf.json",
        left: {StatusCode: 500},
        right: {StatusCode: 500}
    }
];

const dataSource = [
    {"fileName": "{FileName2}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 28292,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    },
    {"fileName": "{FileName3}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 31288,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    },
    {"fileName": "{FileName1}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 15612,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    }
];

const dataOutputAscending = [
    {"fileName": "{FileName1}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 15612,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    },
    {"fileName": "{FileName2}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 28292,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    },
    {"fileName": "{FileName3}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 31288,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    }
];

const dataOutputDescending = [
    {"fileName": "{FileName3}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 31288,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    },
    {"fileName": "{FileName2}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 28292,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    },
    {"fileName": "{FileName1}_pdf.json",
        "left": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"2021-02-02\",\"categoryB\":\"categoryB_value\"}]",
            "TimeMs": 0,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "right": {
            "Body": "[{\"firstname\":\"JOHN\",\"lastname\":\"DOE\",\"birthdate\":\"\",\"categoryB\":null}]",
            "TimeMs": 15612,
            "Url": "https://url",
            "FileDirectory": "fileDirectoryValue",
            "StatusCode": 200
        },
        "id": "ckkpmf0w50000i8egdheo0laa",
        "parse": false,
        "collapse": true
    }
];

describe("Shoudl test TableResult component methods", () => {
    test("Should filter by file extension", () => {
        const onlyImagesExpectedResult = [files[0]];
        expect(filterExtensions(files, "JPG/JPEG")).toEqual(onlyImagesExpectedResult);
        expect(filterExtensions(files, "All")).toEqual(files);
    });

    test("Should filter by status code", () => {
        const only200Status = [files[0]];
        const only500Status = [files[1]];
        expect(filterStatusCode(files, 200)).toEqual(only200Status);
        expect(filterStatusCode(files, 500)).toEqual(only500Status);
    });

    test('Sort by ascending order', async () => {
        const result = sortTime(dataSource, "Ascending", "Right");
        expect(result).toStrictEqual(dataOutputAscending);
    });

    test('Sort by descending order', async () => {
        const result = sortTime(dataSource, "Descending", "Right");
        expect(result).toStrictEqual(dataOutputDescending);
    });
})