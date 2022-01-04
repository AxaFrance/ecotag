import React, {useEffect, useState, useRef} from "react";
import {fetchGetData, utf8_to_b64} from "../FetchHelper";
import {ToastContainer} from "react-toastify";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import {QueryClient, QueryClientProvider} from "react-query";
import ImageGallery from "./ImageGallery";
import GalleryOptions from "./GalleryOptions";
import TitleBar from "../../TitleBar";
import './Gallery.scss';

const resilienceStatus = {
    EMPTY: 'empty',
    LOADING: 'loading',
    POST: 'post',
    SUCCESS: 'success',
    ERROR: 'error',
};

const queryClient = new QueryClient();

export const getFilesInfo = async data => {
    if(data.status === 200) {
        const filesInfoList = await data.json();
        let returnedList = [];
        filesInfoList.forEach(fileInfo => returnedList.push({name: fileInfo.file, url: `api/local/files/${utf8_to_b64(fileInfo.file)}`, date: fileInfo.date}));
        return returnedList;
    } else {
        return {};
    }
}

const loadStateAsync = (fetch) => async (setState, state) => {
    setState({
        ...state,
        status: resilienceStatus.LOADING,
    });
    const uri = encodeURI("/api/local/gallery/" + state.filesPath);
    const response = await fetchGetData(fetch)(uri);
    if (response.status >= 400) {
        const errorMessage = await response.text();
        setState({
            ...state,
            errorMessage,
            status: resilienceStatus.ERROR,
            firstStatus: resilienceStatus.EMPTY
        });
        return;
    }
    const filesList = await getFilesInfo(response);
    setState({
        ...state,
        files: filesList,
        status: resilienceStatus.EMPTY,
        firstStatus: resilienceStatus.EMPTY,
    });
};

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const sortItems = (sortName, files) => {
    let sortedFiles, tempSortDate;
    switch (sortName) {
        case "Recent to old":
            sortedFiles = [...files].sort((a, b) => {
                tempSortDate = (b.date > a.date) ? 1 : 0;
                return (a.date > b.date) ? -1 : tempSortDate;
            });
            break;
        case "Old to recent":
            sortedFiles = [...files].sort((a, b) => {
                tempSortDate = (b.date > a.date) ? -1 : 0;
                return (a.date > b.date) ? 1 : tempSortDate;
            });
            break;
        case "Alphabetic desc":
            sortedFiles = [...files.sort((a, b) => a.name.localeCompare(b.name))].reverse();
            break;
        case "Alphabetic asc":
            sortedFiles = [...files.sort((a, b) => a.name.localeCompare(b.name))];
            break;
    }
    return sortedFiles;
}

const Gallery = ({fetchFunction}) => {
    
    const [state, setState] = useState({
        files: [],
        filesPath: "",
        sortName: "Recent to old",
        size: "128px",
        status: resilienceStatus.EMPTY,
        firstStatus: resilienceStatus.EMPTY,
        errorMessage: ""
    });

    useInterval(() => {
        if(state.status !== resilienceStatus.LOADING && state.filesPath !== ""){
            loadStateAsync(fetchFunction)(setState, state);
        }
    }, state.status === resilienceStatus.ERROR ? 15000: 5000);
    
    const onSubmit = async (options) => {
        const {filesPath} = options;
        if(filesPath === ""){
            setState({...state, ...options, files: [], errorMessage: ""});
            return;
        }
        const uri = encodeURI("/api/local/gallery/" + filesPath);
        const response = await fetchGetData(fetchFunction)(uri);
        if(!response.ok){
            setState({...state, ...options, errorMessage: "New files fetch on options submission failed", files: []});
            return;
        }
        const filesList = await getFilesInfo(response);
        setState({...state, ...options, errorMessage: "", files: filesList});
    }

    const sortedFiles = sortItems(state.sortName, state.files);
    
    return(
        <QueryClientProvider client={queryClient}>
            <Header>
                <Name
                    title="ML-CLI"
                    subtitle="Made by AXA"
                    img={logo}
                    alt="AXA Logo"
                />
            </Header>
            <TitleBar title="Image Gallery" classModifier="af-title-bar--no-space"/>
            <GalleryOptions
                onSubmit={onSubmit}
            />
            {state.filesPath === "" &&
                <h3 className="gallery__info-message">Please provide a directory path</h3>
            }
            {state.errorMessage &&
                <h3 className="gallery__error-message">{state.errorMessage}</h3>
            }
            <ImageGallery
                size={state.size}
                files={sortedFiles}
            />
            <ToastContainer/>
        </QueryClientProvider>
    )
    
};

export default Gallery;