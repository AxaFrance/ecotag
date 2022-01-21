import React, {useState} from "react";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";
import {CheckboxModes, Tabs} from "@axa-fr/react-toolkit-all";
import Button from '@axa-fr/react-toolkit-button';
import {Textarea} from "@axa-fr/react-toolkit-form-input-textarea";
import {CheckboxInput} from "@axa-fr/react-toolkit-form-input-checkbox";
import cuid from "cuid";
import FileLoader from "../FileLoader/FileLoader";
import ScriptEditorContainer from "./ScriptEditorContainer";

const optionsSelect = [
    {value: 'KO', label: "KO"},
    {value: 'OK', label: "OK"},
    {value: 'All', label: 'All'}
];

const extensionsSelect = [
    {value: 'All', label: 'All'},
    {value: 'PNG', label: 'PNG'},
    {value: 'JPG/JPEG', label: 'JPG/JPEG'},
    {value: 'PDF', label: 'PDF'},
    {value: 'TIFF', label: 'TIFF'}
];

const timeSelect = [
    {value: 'Neutral', label: 'Neutral'},
    {value: 'Ascending', label: 'Ascending'},
    {value: 'Descending', label: 'Descending'}
];

const timeSideVariables = [
    {value: 'Left', label: 'Left'},
    {value: 'Right', label: 'Right'}
];

const FileTreatment = ({state, setState, MonacoEditor, fetchFunction}) => {

    const [filterState, setFilterState] = useState({
        filterName: "KO",
        extensionName: "All",
        currentStatusCode: "All",
        searchedString: "",
        timeSide: "Left",
        sortTimeType: "Neutral",
        stringsModifier: "",
        isAnnotationOpen: false,
        loadFileError: false,
        scriptEditorLeft: `
try {
    let body = JSON.parse(rawBodyInput);
    // rawBodyOutput can be updated to format data as you need
    rawBodyOutput = JSON.stringify(body);
    // writing "isSkipped=true" will remove the item from the results
    isSkipped=false;
} catch(ex) {
    console.log("Left parsing crash");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`,
        scriptEditorRight: `
try {
    let body = JSON.parse(rawBodyInput);
    // rawBodyOutput can be updated to format data as you need
    rawBodyOutput = JSON.stringify(body);
    // writing "isSkipped=true" will remove the item from the results
    isSkipped=false;
} catch(ex) {
    console.log("Right parsing crash");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`
    });

    const checkboxOptions = [
        {
            key: "checkbox_isAnnotationOpen",
            id: "is_annotation_open_checkbox",
            value: "test",
            label: "Is annotation open ? ",
            disabled: false
        }
    ];

    const mapItems = data => (data.map(item => {
        if (item.Left == null || item.Right == null){
            return;
        }
        return {
            fileName: item.FileName,
            left: {
                Url: item.Left.Url,
                FileName: item.Left.FileName,
                FileDirectory: item.Left.FileDirectory,
                ImageDirectory: item.Left.ImageDirectory,
                FrontDefaultStringsMatcher: item.Left.FrontDefaultStringsMatcher,
                StatusCode: item.Left.StatusCode,
                Body: item.Left.Body,
                Headers: item.Left.Headers,
                TimeMs: item.Left.TimeMs,
                TicksAt: item.Left.TicksAt
            },
            right: {
                Url: item.Right.Url,
                FileName: item.Right.FileName,
                FileDirectory: item.Right.FileDirectory,
                ImageDirectory: item.Right.ImageDirectory,
                FrontDefaultStringsMatcher: item.Right.FrontDefaultStringsMatcher,
                StatusCode: item.Right.StatusCode,
                Body: item.Right.Body,
                Headers: item.Right.Headers,
                TimeMs: item.Right.TimeMs,
                TicksAt: item.Right.TicksAt
            },
            id: cuid(),
            parse: false,
            collapse: true,
        };
    }));

    const compareStatusCode = (status, result) => {
        const strStatus = status.toString();
        const index = result.findIndex(element => element.value === strStatus);
        if (index !== -1){
            return;
        }
        const newItem = {value: strStatus, label: strStatus};
        result.push(newItem);
    };

    const setStatusFilterItems = newItems => {
        const allCodes = {value: "All", label: "All"};
        const result = [allCodes];
        newItems.forEach(item => {
            compareStatusCode(item.left.StatusCode, result);
            compareStatusCode(item.right.StatusCode, result);
        });
        return result;
    };

    const onLoad = (result, fileName) => {
        const isVersion0 = Array.isArray(result);
        if (!result.hasOwnProperty('CompareLocation')) {
            onLoadFailure(fileName);
        } else {
            const location = isVersion0 ? "" : result.CompareLocation;
            const mappedItems = mapItems(isVersion0 ? result : result.Content);
            const statusCodeItems = setStatusFilterItems(mappedItems);
            setState
            ({
                ...state,
                fileName: fileName,
                compareLocation: location,
                items: mappedItems,
                statusCodes: statusCodeItems
            });
            setFilterState({...filterState, loadFileError: false});
        }
    };

    const onLoadFailure = fileName => {
        setState({...state, fileName: fileName, items: []});
        setFilterState({...filterState, loadFileError: true});
    };

    const applyFilters = () => {
        setState({
            ...state,
            filters: {
                ...state.filters,
                filterName: filterState.filterName,
                extensionName: filterState.extensionName,
                currentStatusCode: filterState.currentStatusCode,
                searchedString: filterState.searchedString,
                timeSide: filterState.timeSide,
                sortTimeType: filterState.sortTimeType,
                stringsModifier: filterState.stringsModifier,
                filterLeft: filterState.scriptEditorLeft,
                filterRight: filterState.scriptEditorRight,
                pagingCurrent: 1
            },
            isAnnotationOpen: filterState.isAnnotationOpen
        });
    };

    return (
        <>
            <FileLoader
                id="file_loader"
                name="placeJsonFile"
                accept="application/json"
                onLoad={(reader, e) => onLoad(reader, e)}
                onFailure={e => onLoadFailure(e)}
                controllerPath="api/local/compares"
                fetchFunction={fetchFunction}
            />

            <div className="tabs">
                <Tabs className="tabs__header">
                    <Tabs.Tab title="Filters">
                        <div className="tabs__container tabs__container--justify">
                            <div className="tabs__filter-container">
                                <p className="tabs__title">File state:</p>
                                <SelectBase
                                    id="select_type"
                                    name="SelectType"
                                    value={filterState.filterName}
                                    options={optionsSelect}
                                    onChange={e => {
                                        setFilterState({...filterState, filterName: e.value});
                                    }}
                                />
                                <p className="tabs__title">Files extensions:</p>
                                <SelectBase
                                    id="extension_type"
                                    name="ExtensionType"
                                    value={filterState.extensionName}
                                    options={extensionsSelect}
                                    onChange={e => {
                                        setFilterState({...filterState, extensionName: e.value});
                                    }}
                                />
                                <p className="tabs__title">Server status:</p>
                                <SelectBase
                                    id="status_code_type"
                                    name="StatusCodeType"
                                    value={filterState.currentStatusCode}
                                    options={state.statusCodes}
                                    onChange={e => {
                                        setFilterState({...filterState, currentStatusCode: e.value});
                                    }}
                                />
                            </div>
                            <div className="tabs__filter-container">
                                <p className="tabs__title">Search Bar:</p>
                                <Textarea
                                    id="text_area_searchbar"
                                    name="TextAreaSearchBar"
                                    value={filterState.searchedString}
                                    onChange={e => {
                                        setFilterState({...filterState, searchedString: e.value});
                                    }}
                                />
                            </div>
                        </div>
                    </Tabs.Tab>
                    <Tabs.Tab title="Time">
                        <div className="tabs__container tabs__container--justify">
                            <div className="tabs__filter-container">
                                <p className="tabs__title">Filter side:</p>
                                <SelectBase
                                    id="time_side"
                                    name="TimeSide"
                                    value={filterState.timeSide}
                                    options={timeSideVariables}
                                    onChange={e => {
                                        setFilterState({
                                            ...filterState, timeSide: e.value
                                        });
                                    }}
                                />
                                <p className="tabs__title">Time:</p>
                                <SelectBase
                                    id="time_filter"
                                    name="TimeFilter"
                                    value={filterState.sortTimeType}
                                    options={timeSelect}
                                    onChange={e => {
                                        setFilterState({
                                            ...filterState, sortTimeType: e.value
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </Tabs.Tab>
                    <Tabs.Tab title="Scripts">
                        <ScriptEditorContainer
                            fileTreatmentState={filterState}
                            setFileTreatmentState={setFilterState}
                            MonacoEditor={MonacoEditor}
                        />
                    </Tabs.Tab>
                    <Tabs.Tab title="Configuration">
                        <div className="tabs__container tabs__container--justify">
                            <div className="tabs__filter-container">
                                <p className="tabs__title">Change images selection criterias:</p>
                                <Textarea
                                    id="text_area_stringsMatcherModifier"
                                    name="TextAreaStringsMatcherModifier"
                                    value={filterState.stringsModifier}
                                    onChange={e => {
                                        setFilterState({
                                            ...filterState,
                                            stringsModifier: e.value
                                        });
                                    }}
                                />
                                <div className="tabs__title tabs__title--annotation-checkbox">
                                    <CheckboxInput
                                        id="is_annotation_open_checkbox"
                                        name="isAnnotationOpenCheckbox"
                                        mode={CheckboxModes.toggle}
                                        label="Open annotations:"
                                        isChecked={filterState.isAnnotationOpen}
                                        onChange={() => setFilterState({
                                            ...filterState,
                                            isAnnotationOpen: !filterState.isAnnotationOpen
                                        })}
                                        options={checkboxOptions}/>
                                </div>
                            </div>
                        </div>
                    </Tabs.Tab>
                </Tabs>
            </div>

            <div className="file-input">
                <Button id="submit-btn" onClick={() => applyFilters()}>Apply filters</Button>
            </div>

            {filterState.loadFileError &&
            <h2 className="error-message">
                An error occured while loading file.
            </h2>
            }
        </>
    );
};

export default FileTreatment;
