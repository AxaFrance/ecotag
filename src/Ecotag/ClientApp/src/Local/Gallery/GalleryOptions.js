import React, {useState} from "react";
import {Text} from "@axa-fr/react-toolkit-form-input-text";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";
import Button from '@axa-fr/react-toolkit-button';
import './GalleryOptions.scss';

const optionsSelect = [
    {value: 'Recent to old', label: 'Recent to old'},
    {value: 'Old to recent', label: 'Old to recent'},
    {value: 'Alphabetic asc', label: 'Alphabetic asc'},
    {value: 'Alphabetic desc', label: 'Alphabetic desc'}
];

const sizeOptionsSelect = [
    {value: "64px", label: '64px'},
    {value: "128px", label: '128px'},
    {value: "256px", label: '256px'},
    {value: "512px", label: '512px'}
];

const GalleryOptions = ({onSubmit}) => {

    const [filterState, setFilterState] = useState({
        filesPath: "",
        sortName: "Recent to old",
        size: "128px"
    });

    return (
        <div className="gallery__header">
            <div className="gallery__options-container-left">
                <p className="tabs__title">Directory name:</p>
                <Text
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
                    id="select_type_sort"
                    name="SelectTypeSort"
                    value={filterState.sortName}
                    options={optionsSelect}
                    onChange={e => {
                        setFilterState({...filterState, sortName: e.value});
                    }}
                />
                <p className="tabs__title">Size:</p>
                <SelectBase
                    id="select_type_size"
                    name="SelectTypeSize"
                    value={filterState.size}
                    options={sizeOptionsSelect}
                    onChange={e => {
                        setFilterState({...filterState, size: e.value});
                    }}
                />
            </div>
            <div className="gallery__options-container-right">
                <Button onClick={() => onSubmit(filterState)}>Apply filters</Button>
            </div>
        </div>
    )
};

export default GalleryOptions;