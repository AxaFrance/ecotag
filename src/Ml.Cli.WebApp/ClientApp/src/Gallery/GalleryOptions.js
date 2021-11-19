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
    {value: 64, label: '64px'},
    {value: 128, label: '128px'},
    {value: 256, label: '256px'},
    {value: 512, label: '512px'}
];

const GalleryOptions = ({parentState, setParentState}) => {
    
    const [state, setState] = useState({
        filesPath: "",
        sortName: "Recent to old",
        size: '128px'
    });
    
    const applyOptions = () => {
        setParentState({...parentState, filesPath: state.filesPath,  sortName: state.sortName, size: state.size});
    }
    
    return(
        <div className="gallery__header">
            <div className="gallery__options-container-left">
                <p className="tabs__title">Directory name:</p>
                <Textarea
                    id="text_area_stringsMatcherModifier"
                    name="TextAreaStringsMatcherModifier"
                    value={state.filesPath}
                    onChange={e => {
                        setState({
                            ...state,
                            filesPath: e.value
                        });
                    }}
                />
                <p className="tabs__title">Sort by:</p>
                <SelectBase
                    id="select_type"
                    name="SelectType"
                    value={state.sortName}
                    options={optionsSelect}
                    onChange={e => {
                        setState({...state, sortName: e.value});
                    }}
                />
                <p className="tabs__title">Size:</p>
                <SelectBase
                    id="select_type"
                    name="SelectType"
                    value={state.size}
                    options={sizeOptionsSelect}
                    onChange={e => {
                        setState({...state, size: e.value});
                    }}
                />
            </div>
            <div className="gallery__options-container-right">
                <Button onClick={() => applyOptions()}>Submit</Button>
            </div>
        </div>
    )
};

export default GalleryOptions;