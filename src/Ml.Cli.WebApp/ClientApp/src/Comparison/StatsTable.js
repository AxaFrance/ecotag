import React, {useState} from "react";
import {totalScores} from "./score";
import {filterItems} from './TableResult';
import ExcelExport from "./ExcelExport";
import {CheckboxInput, CheckboxModes} from "@axa-fr/react-toolkit-form-input-checkbox";
import Help from "@axa-fr/react-toolkit-help";

export const computeTotalTimeMs = items => {
    const timeLeft = items.reduce((accumulator, currentItem) => accumulator + currentItem.left.TimeMs, 0);
    const timeRight = items.reduce((accumulator, currentItem) => accumulator + currentItem.right.TimeMs, 0);
    
    return {rightTimeMs: timeRight, leftTimeMs: timeLeft};
};

export const orderByStatusCode = items => {
    const statusCodes = {};
    items.forEach(item => setStatusCodesList(statusCodes, item));
    return statusCodes;
};

const setStatusCodesList = (statusCodes, item) => {
    if(!item.right.StatusCode || !item.left.StatusCode){
        return;
    }
    if(!statusCodes[item.right.StatusCode.toString()]){
        statusCodes[item.right.StatusCode.toString()] = { right: 1, left:0 };
    } else{
        statusCodes[item.right.StatusCode.toString()].right ++;
    }
    if(!statusCodes[item.left.StatusCode.toString()]){
        statusCodes[item.left.StatusCode.toString()] = { right: 0, left:1 };
    } else{
        statusCodes[item.left.StatusCode.toString()].left ++;
    }
}

const calcSideTotalCompleteness = (side, levenshteinResults, numberItems) => {
    const totalValues = [];
    for(const key of Object.keys(levenshteinResults)){
        const tempObject = levenshteinResults[key];
        if(!(tempObject[side].ok === tempObject[side].ko && tempObject[side].ok === 0)){
            const tempValueByKey = tempObject[side].ok * 100 / numberItems;
            totalValues.push(tempValueByKey);
        }
    }
    const reduced = totalValues.reduce((a, b) => a + b, 0);
    return (reduced / totalValues.length).toFixed(2);
};

export const calcTotalCompleteness = (levenshteinResults, numberItems) => {
    const totalLeftCompleteness = calcSideTotalCompleteness("completeness_left", levenshteinResults, numberItems);
    const totalRightCompleteness = calcSideTotalCompleteness("completeness_right", levenshteinResults, numberItems);
    return {left: totalLeftCompleteness, right: totalRightCompleteness};
};

const StatusCode = ({statusCodes}) => {
    const statuses =  Object.keys(statusCodes).map(function(key) {
        const value = statusCodes[key];
        return <div className="stats__results" key={key}>
            <div className="stats__results-info stats__results-info--separator">
                <span>Status Code : {key} </span></div>
            <div className="stats__results-info stats__results-info--separator">
                <span>Number on the left : {value.left} </span></div>
            <div className="stats__results-info"> <span>Number on the right : {value.right} </span></div>
        </div>
    });

    return <>{statuses}</>
}

const Scores = ({levenshteinResults}) => {
    const keys = Object.keys(levenshteinResults);
    const ScoreItems =  keys.map(function(key) {
        const keyValue = levenshteinResults[key];
        return <div className="stats__results" key={key}>
            <div className="stats__results-info stats__results-info--separator">
                <span>Key : {key} </span></div>
            <div className="stats__results-info stats__results-info--separator">
                <ul>
                    <li>Levenshtein score : {keyValue.score} </li>
                    <li>Number OK : {keyValue.score_ok} </li>
                    <li>Number KO : {keyValue.score_ko} </li>
                    <li>Number Total : {keyValue.total} </li>
                    <li>Completeness OK Left : {keyValue.completeness_left.ok}</li>
                    <li>Completeness KO Left : {keyValue.completeness_left.ko}</li>
                    <li>Completeness OK Right : {keyValue.completeness_right.ok}</li>
                    <li>Completeness KO Right : {keyValue.completeness_right.ko}</li>
                </ul>
            </div>
            <div className="stats__results-info">
                <span>Percentage OK : {keyValue.percentages.ok}</span>
                <br/>
                <span>Percentage completeness OK Left : {keyValue.percentages.completeness_ok_left}</span>
                <br />
                <span>Percentage completeness OK Right : {keyValue.percentages.completeness_ok_right}</span>
            </div>
        </div>
    });

    return <>{ScoreItems}</>
}

const statsErrorsOptions = [
    {
        key:"checkbox_areErrorsCounted",
        id:"are_errors_counted_checkbox",
        value:"errorsValue",
        label:"Are errors counted ?",
        disabled: false
    }
];

const StatsTable = ({state, setState, items}) => {

    const [statsState, setStatsState] = useState({
        areErrorsRemoved: false
    });
    
    const filteredItems = statsState.areErrorsRemoved ?
        items.filter(item => item.left.StatusCode === 200 && item.right.StatusCode === 200) :
        items;
    const levenshteinResults = totalScores(filteredItems, ["document_id", "document_type"]);
    const totalTimeMs = computeTotalTimeMs(filteredItems);
    const statusCodes = orderByStatusCode(filteredItems);
    const totalCompleteness = calcTotalCompleteness(levenshteinResults, filteredItems.length);
    const fileInfo =
        {
            ok: filterItems(filteredItems, "OK").length,
            ko: filterItems(filteredItems, "KO").length,
            total: filteredItems.length
        };
    
    return(
        <>
            <div className="stats" key="StatsTableKey">
                <div className="stats__title">
                    <span>Stats:</span>
                    <div className="table-result__collapse-button" onClick={() => {setState({...state, isStatsTableShowed: !state.isStatsTableShowed})}}>{state.isStatsTableShowed ? "-" : "+"}</div>
                </div>
                {state.isStatsTableShowed && (
                    <>
                        <div className="stats__results stats__results--header">
                            <CheckboxInput
                                id="are_errors_counted_checkbox"
                                name="areErrorsCountedCheckbox"
                                mode={CheckboxModes.toggle}
                                isChecked={statsState.areErrorsRemoved}
                                label="Remove errors from stats:"
                                onChange={() => setStatsState({...statsState, areErrorsRemoved: !statsState.areErrorsRemoved})}
                                options={statsErrorsOptions}
                            />
                            <ExcelExport
                                fileInfo={fileInfo}
                                statusCodes={statusCodes}
                                levenshteinResults={levenshteinResults}
                                totalCompleteness={totalCompleteness}
                                timeMS={totalTimeMs}
                            />
                        </div>
                        <div className="stats__results">
                            <div className="stats__results-info stats__results-info--separator">
                                <span>OK Files: {filterItems(filteredItems, "OK").length}</span></div>
                            <div className="stats__results-info stats__results-info--separator">
                                <span>KO Files: {filterItems(filteredItems, "KO").length}</span></div>
                            <div className="stats__results-info"><span>Total : {filteredItems.length}</span></div>
                        </div>
                        <div className="stats__results">
                            <div className="stats__results-info stats__results-info--double-columns stats__results-info--separator">
                                <Help
                                    placement="right"
                                    children="Number of files containing all the keys (non null and not empty)"
                                    mode="hover"
                                />
                                <span>Completeness left : {totalCompleteness.left}%</span>
                            </div>
                            <div className="stats__results-info stats__results-info--double-columns">
                                <span>Completeness right : {totalCompleteness.right}%</span>
                            </div>
                        </div>
                        <div className="stats__results">
                            <div className="stats__results-info stats__results-info--separator">
                                <span>Total time left : {totalTimeMs.leftTimeMs / 1000} seconds</span></div>
                            <div className="stats__results-info stats__results-info--separator">
                                <span>Total time right : {totalTimeMs.rightTimeMs / 1000} seconds</span></div>
                            <div className="stats__results-info"><span>Difference : {(totalTimeMs.rightTimeMs - totalTimeMs.leftTimeMs) / 1000} seconds (+{Math.round((totalTimeMs.leftTimeMs / totalTimeMs.rightTimeMs) *100)}% gain)</span></div>
                        </div>
                        <div className="stats__results">
                            <div className="stats__results-info stats__results-info--separator">
                                <span>Average time left : {(totalTimeMs.leftTimeMs / filteredItems.length) / 1000} seconds</span></div>
                            <div className="stats__results-info stats__results-info--separator">
                                <span>Average time right : {(totalTimeMs.rightTimeMs / filteredItems.length) / 1000} seconds</span></div>
                            <div className="stats__results-info"><span>Difference : {((totalTimeMs.rightTimeMs - totalTimeMs.leftTimeMs) / filteredItems.length) / 1000} seconds (+{Math.round((totalTimeMs.leftTimeMs / totalTimeMs.rightTimeMs) * 100)}% gain)</span></div>
                        </div>
                        <StatusCode statusCodes={statusCodes}  />
                        <Scores
                            levenshteinResults={levenshteinResults}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default StatsTable;