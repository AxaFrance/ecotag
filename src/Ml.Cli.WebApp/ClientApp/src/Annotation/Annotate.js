import React, {useState} from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import DatasetHandler from "./DatasetHandler";
import AnnotationsContainer from "./AnnotationsContainer";
import {QueryClient, QueryClientProvider} from "react-query";
import TitleBar from "../TitleBar/TitleBar";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Annotate.scss';

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
            <DatasetHandler state={state} setState={setState} fetchFunction={fetchFunction}/>
            {state.items.length > 0 ? (
                <AnnotationsContainer state={state} MonacoEditor={MonacoEditor} fetchFunction={fetchFunction}/>
            ) : (state.isFileInserted &&
                <h2 className="error-message">Le fichier d'annotation est vide.</h2>
            )}
            <ToastContainer/>
        </QueryClientProvider>
    );
};

export default Annotate;
