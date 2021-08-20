import React, {useState} from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import TableResult from "./TableResult";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import './Compare.scss';
import {QueryClient, QueryClientProvider} from "react-query";
import FileTreatment from "../FileTreatment/FileTreatment";
import TitleBar from "../TitleBar/TitleBar";

const queryClient = new QueryClient();

const Compare = ({MonacoEditor, fetchFunction}) => {

    const [state, setState] = useState({
        fileName: "Comparer un fichier JSON",
        compareLocation: "",
        items: [],
        filters: {
            filterName: "KO",
            extensionName: "Tout",
            currentStatusCode: "Tout",
            searchedString: "",
            stringsModifier: "",
            sortTimeType: "Neutre",
            timeSide: "Gauche",
            pagingSelect: 50,
            pagingCurrent: 1,
            filterRight: `
try {
    let body = JSON.parse(rawBodyInput);
    // rawBodyOutput can be updated to format data as you need
    rawBodyOutput = JSON.stringify(body);
    // writing "isSkipped=true" will remove the item from the results
    isSkipped=false;
} catch(ex) {
    console.log("Plantage parsing left");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`,
            filterLeft: `
try {
    let body = JSON.parse(rawBodyInput);
    // rawBodyOutput can be updated to format data as you need
    rawBodyOutput = JSON.stringify(body);
    // writing "isSkipped=true" will remove the item from the results
    isSkipped=false;
} catch(ex) {
    console.log("Plantage parsing left");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`
        },
        statusCodes: [{value: "Tout", label: "Tout"}],
        isStatsTableShowed: true,
        isAnnotationOpen: false
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
                title={state.fileName === "Comparer un fichier JSON" ? state.fileName : "Fichier en cours de visualisation : " + state.fileName}/>
            <FileTreatment state={state} setState={setState} MonacoEditor={MonacoEditor}/>
            {state.items.length > 0 &&
            <TableResult state={state} setState={setState} MonacoEditor={MonacoEditor} fetchFunction={fetchFunction}/>
            }
        </QueryClientProvider>
    );
}

export default Compare;
