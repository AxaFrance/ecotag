import React, {useState} from "react";
import {Textarea} from "@axa-fr/react-toolkit-form-input-textarea";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";
import Button from '@axa-fr/react-toolkit-button';
import './GalleryOptions.scss';

const optionsSelect = [
    {value: 'Recent to old', label: 'Recent to old'},
    {value: 'Old to recent', label: 'Old to recent'},
    {value: 'Alphabetic desc', label: 'Alphabetic desc'},
    {value: 'Alphabetic asc', label: 'Alphabetic asc'}
];

const sizeOptionsSelect = [
    {value: "64px", label: '64px'},
    {value: "128px", label: '128px'},
    {value: "256px", label: '256px'},
    {value: "512px", label: '512px'}
];

const GalleryOptions = ({state, setState, onSubmit}) => {
    
    const [filterState, setFilterState] = useState({
        filesPath: "",
        sortName: "Recent to old",
        size: "128px"
    });
    
    const applyOptions = () => {
        setState({
            ...state,
            sortName: filterState.sortName,
            size: filterState.size
        });
        onSubmit(filterState.filesPath);
    }
    
    return(
        <div className="gallery__header">
            <div className="gallery__options-container-left">
                <p className="tabs__title">Directory name:</p>
                <Textarea
                    id="text_area_stringsMatcherModifier"
                    name="TextAreaStringsMatcherModifier"
                    value={filterState.filesPath}
                    onChange={e => {
                        setFilterState({
                            ...filterState,
                            filesPath: e.value
                        });
                    }}
                />
                <p className="tabs__title">Sort by:</p>
                <SelectBase
                    id="select_type"
                    name="SelectType"
                    value={filterState.sortName}
                    options={optionsSelect}
                    onChange={e => {
                        setFilterState({...filterState, sortName: e.value});
                    }}
                />
                <p className="tabs__title">Size:</p>
                <SelectBase
                    id="select_type"
                    name="SelectType"
                    value={filterState.size}
                    options={sizeOptionsSelect}
                    onChange={e => {
                        setFilterState({...filterState, size: e.value});
                    }}
                />
            </div>
            <div className="gallery__options-container-right">
                <Button onClick={() => applyOptions()}>Apply filters</Button>
            </div>
        </div>
    )
};

export default GalleryOptions;