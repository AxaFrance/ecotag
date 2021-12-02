import React, {useEffect, useState, useRef} from "react";
import {fetchGetData, utf8_to_b64} from "../../FetchHelper";
import {ToastContainer} from "react-toastify";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import {QueryClient, QueryClientProvider} from "react-query";
import ImageGallery from "./ImageGallery";
import GalleryOptions from "./GalleryOptions";
import TitleBar from "../TitleBar/TitleBar";
import {resilienceStatus} from './withResilience';

const queryClient = new QueryClient();

export const getFilesInfo = async data => {
    if(data.status === 200) {
        const hardDriveLocations = await data.json();
        let returnedList = [];
        hardDriveLocations.forEach(file => returnedList.push({name: file, url: `api/files/${utf8_to_b64(file)}`}));
        return returnedList;
    } else {
        return {};
    }
}

const loadStateAsync = (fetch) => async (setState, state, filesPath) => {
    setState({
        ...state,
        status: resilienceStatus.LOADING,
    });
    const uri = encodeURI("/api/gallery/" + filesPath);
    const response = await fetchGetData(fetch)(uri);
    if (response.status >= 300) {
        setState({
            ...state,
            status: resilienceStatus.ERROR,
            firstStatus: resilienceStatus.EMPTY,
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

const Gallery = ({fetchFunction}) => {
    
    //https://axafrance.visualstudio.com/Kubernetes/_git/dailyclean-api?path=%2Fweb%2Fsrc%2FApiStateProvider.js&version=GBmain
    //En bas: solution au problème de sauvegarde du state
    
    const [state, setState] = useState({
        files: [],
        filesPath: "",
        sortName: "Recent to old",
        size: "128px",
        status: resilienceStatus.EMPTY,
        firstStatus: resilienceStatus.EMPTY,
    });

    useInterval(() => {
        if(state.status !== resilienceStatus.LOADING && state.filesPath !== ""){
            loadStateAsync(fetchFunction)(setState, state, state.filesPath);
        }
    }, state.status === resilienceStatus.ERROR ? 15000: 5000);
    
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
                state={state}
                setState={setState}
            />
            <ImageGallery
                parentState={state}
            />
            <ToastContainer/>
        </QueryClientProvider>
    )
    
};

export default Gallery;