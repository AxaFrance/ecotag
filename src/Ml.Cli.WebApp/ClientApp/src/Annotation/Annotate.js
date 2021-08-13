﻿import React, {useState} from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import DatasetHandler from "./DatasetHandler";
import TableAnnotate from "./TableAnnotate";
import {QueryClient, QueryClientProvider} from "react-query";
import TitleBar from "../TitleBar/TitleBar";

const queryClient = new QueryClient();

const Annotate = ({MonacoEditor, fetchFunction}) => {

    const [state, setState] = useState({
        fileName: "Annoter un dataset",
        datasetLocation: "",
        items: [],
        annotationType: "JsonEditor",
        configuration: [{name: "Default", id: 0}]
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Header>
                <Name
                    title="ML-CLI"
                    subtitle="Made by AXA"
                    img={logo}
                    alt="Logo AXA"
                />
            </Header>
            <TitleBar
                title={state.fileName === "Annoter un dataset" ? state.fileName : `Fichier en cours de visualisation : ${state.fileName}`}/>
            <DatasetHandler state={state} setState={setState} fetchFunction={fetchFunction}/>
            {state.items.length > 0 &&
            <TableAnnotate state={state} MonacoEditor={MonacoEditor} fetchFunction={fetchFunction}/>
            }
        </QueryClientProvider>
    );
};

export default Annotate;
