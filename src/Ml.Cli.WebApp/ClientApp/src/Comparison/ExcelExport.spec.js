import React from "react";
import {createCsvContent} from "./ExcelExport";

const fileInfo = {
    ok: 2,
    ko: 1
};

const statusCodes = {
    200: {
        left: 3,
        right: 3
    }
};

const levenshteinResults = {
    "0_firstname": {
        completeness_left: {
            ko: 1,
            ok: 2
        },
        completeness_right: {
            ko: 0,
            ok: 3
        },
        percentages: {
            completeness_ok_left: "100.00 %",
            completeness_ok_right: "100.00 %",
            ok: "66.67 %"
        },
        score: 14,
        score_ko: 1,
        score_ok: 2,
        total: 3
    }
};

const timeMS = {
    leftTimeMs: 0,
    rightTimeMs: 100
};

const totalCompleteness = {
    left: "100.00",
    right: "100.00"
};

const expectedResult = "data:text/csv;charset=UTF-8,Fichiers OK,Fichiers KO,Total,,Left completeness,Right completeness \r\n" +
    "2,1,,,100.00,100.00 \r\n" +
    " \r\n" +
    "Left total time,Right total time,Difference \r\n" +
    "0 secondes,0.1 secondes,0.1 secondes soit 0 % de gain \r\n" +
    "Average left time,Average right time,Difference \r\n" +
    "NaN secondes,NaN secondes,NaN soit 0 % de gain \r\n" +
    " \r\n" +
    "Status code,Left status code number,Right status code number \r\n" +
    "200,3,3 \r\n" +
    " \r\n" +
    "Key,Levenshtein score,Number Ok,Number KO,Number total,Completeness OK left,Completeness KO left,Completeness OK right,Completeness KO right,Percentage OK,Percentage completeness OK left,Percentage completeness OK right \r\n" +
    "0_firstname,14,2,1,3,2,1,3,0,66.67 %,100.00 %,100.00 % \r\n";

describe("Check csv generation", () => {
    test("Should generate correct csv file", async () => {
        const result = createCsvContent(fileInfo, statusCodes, levenshteinResults, timeMS, totalCompleteness);
        expect(result).toEqual(expectedResult);
    });
});
