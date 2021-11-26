import React, {useEffect, useState, useRef} from "react";
import {fetchGetData, utf8_to_b64} from "../../FetchHelper";
import {getDataPaths} from "../Comparison/ImagesLoader";
import {ToastContainer} from "react-toastify";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import {QueryClient, QueryClientProvider} from "react-query";
import ImageGallery from "./ImageGallery";
import GalleryOptions from "./GalleryOptions";
import TitleBar from "../TitleBar/TitleBar";
import {resilienceStatus} from './withResilience';

const queryClient = new QueryClient();

const loadStateAsync = (fetch) => async (setState, state, filesPath) => {
    setState({
        ...state,
        status: resilienceStatus.LOADING,
    });
    const params = "directory=" + filesPath;
    const response = await fetchGetData(fetch)("api/datasets" + utf8_to_b64(params));
    if (response.status >= 300) {
        setState({
            ...state,
            status: resilienceStatus.ERROR,
            firstStatus: resilienceStatus.EMPTY,
        });
        return;
    }
    const data = await getDataPaths(response);
    setState({
        ...state,
        data,
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
    
    const [state, setState] = useState({
        files: [],
        filesPath: "",
        sortName: "Recent to old",
        size: "128px"
    });

    useInterval(() => {
        if(state.status !== resilienceStatus.LOADING && state.filesPath !== ""){
            loadStateAsync(fetchFunction)(setState, state);
        }
    }, state.status === resilienceStatus.ERROR ? 15000: 2000);
    
    useEffect(() => {
        loadStateAsync(fetchFunction)(setState, state);
    }, []);
    
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