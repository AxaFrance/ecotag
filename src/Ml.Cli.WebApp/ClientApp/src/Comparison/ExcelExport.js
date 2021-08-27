import React from "react";
import Button from '@axa-fr/react-toolkit-button';
import './ExcelExport.scss';

export const createCsvContent = (fileInfo, statusCodes, levenshteinResults, timeMS, totalCompleteness) => {

    const rows = [
        ["OK Files", "KO Files", "Total", "", "Left completeness", "Right completeness"],
        [fileInfo.ok,fileInfo.ko,fileInfo.total,"",totalCompleteness.left, totalCompleteness.right],
        [],
        ["Left total time", "Right total time", "Difference"],
        [`${timeMS.leftTimeMs / 1000} seconds`, `${timeMS.rightTimeMs / 1000} seconds`, `${(timeMS.rightTimeMs - timeMS.leftTimeMs) / 1000} seconds (${Math.round((timeMS.leftTimeMs / timeMS.rightTimeMs) *100)} % gain)`],
        ["Average left time", "Average right time", "Difference"],
        [`${(timeMS.leftTimeMs / fileInfo.total) / 1000} seconds`, `${(timeMS.rightTimeMs / fileInfo.total) / 1000} seconds`, `${((timeMS.rightTimeMs - timeMS.leftTimeMs) / fileInfo.total) / 1000} seconds (${Math.round((timeMS.leftTimeMs / timeMS.rightTimeMs) * 100)} % gain)`],
        [],
        ["Status code", "Left status code number", "Right status code number"],
        [],
        ["Key", "Levenshtein score", "Number Ok", "Number KO", "Number total", "Completeness OK left", "Completeness KO left", "Completeness OK right", "Completeness KO right", "Percentage OK", "Percentage completeness OK left", "Percentage completeness OK right"]
    ];
    const statusCodesArray = addStatusCodesArray(statusCodes);
    const levenshteinResultsArray = addLevenshteinResultsArray(levenshteinResults);
    rows.splice.apply(rows, [9, 0].concat(statusCodesArray));
    const arrayResult = rows.concat(levenshteinResultsArray);

    let csvContent = "data:text/csv;charset=UTF-8,";

    arrayResult.forEach(function(rowArray){
        const row = rowArray.join(",");
        csvContent += `${row} \r\n`;
    });
    return csvContent;
};

const addStatusCodesArray = (statusCodes) => {
    const statusCodesArray = [];
    Object.keys(statusCodes).forEach(function(key){
        const row = [key, statusCodes[key].left, statusCodes[key].right];
        statusCodesArray.push(row);
    });
    return statusCodesArray;
};

const addLevenshteinResultsArray = (levenshteinResults) => {
    const levenshteinResultsArray = [];
    Object.keys(levenshteinResults).forEach(function(key){
        const value = levenshteinResults[key];
        const row = [
            key,
            value.score,
            value.score_ok,
            value.score_ko,
            value.total,
            value.completeness_left.ok,
            value.completeness_left.ko,
            value.completeness_right.ok,
            value.completeness_right.ko,
            value.percentages.ok,
            value.percentages.completeness_ok_left,
            value.percentages.completeness_ok_right
        ];
        levenshteinResultsArray.push(row);
    });
    return levenshteinResultsArray;
};

const ExcelExport = ({fileInfo, statusCodes, levenshteinResults, timeMS, totalCompleteness}) => {
    
    const saveData = () => {
        const csvContent = createCsvContent(fileInfo, statusCodes, levenshteinResults, timeMS, totalCompleteness);
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "compareData_score.csv");
        document.body.appendChild(link);
        
        link.click();
    };
    
    return <div className="excel-export-btn">
        <div className="excel-export-btn__container">
            <Button onClick={saveData}>Export</Button>
        </div>
    </div>;
};

export default ExcelExport;
