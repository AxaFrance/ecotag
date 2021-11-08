import React, {useState} from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import DatasetHandler from "./DatasetHandler";
import {QueryClient, QueryClientProvider} from "react-query";
import TitleBar from "../TitleBar/TitleBar";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Annotate.scss';
import Routes from "./Routes";
import {useHistory} from "react-router";

const queryClient = new QueryClient();

const Annotate = ({MonacoEditor, fetchFunction}) => {

    const [state, setState] = useState({
        fileName: "Annotate a dataset",
        datasetLocation: "",
        items: [],
        annotationType: "JsonEditor",
        configuration: [{name: "Default", id: 0}],
        isFileInserted: false
    });
    
    const reinitState = () => {
        setState({
            fileName: "Annotate a dataset",
            datasetLocation: "",
            items: [],
            annotationType: "JsonEditor",
            configuration: [{name: "Default", id: 0}],
            isFileInserted: false
        });
    };
    
    const history=useHistory();

    return (
        <QueryClientProvider client={queryClient}>
            <Header>
                <Name
                    title="ML-CLI"
                    subtitle="Made by AXA"
                    img={logo}
                    alt="AXA Logo"
                />
            </Header>
            <TitleBar
                title={state.fileName === "Annotate a dataset" ? state.fileName : `Visualising file: ${state.fileName}`}/>
            {state.items.length === 0 ? (
                <>
                <DatasetHandler state={state} setState={setState} history={history} fetchFunction={fetchFunction}/>
                {state.isFileInserted &&
                    <h2 className="error-message">The annotation file is empty.</h2>}
                </>
            ) : (
                    <Routes annotationState={state} MonacoEditor={MonacoEditor} fetchFunction={fetchFunction} onStateReinit={reinitState}/>
            )}
            <ToastContainer/>
        </QueryClientProvider>
    );
};

export default React.memo(Annotate);
