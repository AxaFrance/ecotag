import React, {useEffect, useState} from "react";
import {fetchGetData, utf8_to_b64} from "../FetchHelper";
import {getDataPaths} from "../Comparison/ImagesLoader";
import {ToastContainer} from "react-toastify";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import {QueryClient, QueryClientProvider} from "react-query";
import TitleBar from "../TitleBar/TitleBar";
import Gallery from "./Gallery";
import GalleryOptions from "./GalleryOptions";

const queryClient = new QueryClient();

const getFiles = async(fetchFunction, controllerPath, filesPath) => {
    if(filesPath){
        const params = "directory=" + filesPath;
        const result = await fetchGetData(fetchFunction)(controllerPath + utf8_to_b64(params));
        return await getDataPaths(result);
    }
    return [];
}

const ImageGallery = ({fetchFunction}) => {
    
    const [state, setState] = useState({
        files: [],
        filesPath: "",
        sortName: "Recent to old",
        size: '128px'
    });
    
    useEffect(() => {
        tick();
        const timerID = setInterval(
            () => tick(),
            5000
        );
        return function cleanup(){
            clearInterval(timerID);
        }
    }, []);
    
    const tick = () => {
        getFiles(fetchFunction, "api/datasets", state.filesPath)
            .then(files => {
                setState({...state, files});
            })
    };
    
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
                parentState={state}
                setParentState={setState}
            />
            <Gallery
                parentState={state}
            />
            <ToastContainer/>
        </QueryClientProvider>
    )
    
};

export default ImageGallery;