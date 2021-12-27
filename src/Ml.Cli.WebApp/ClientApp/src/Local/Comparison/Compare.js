import React, {useState} from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import TableResult from "./TableResult";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import './Compare.scss';
import {QueryClient, QueryClientProvider} from "react-query";
import FileTreatment from "../FileTreatment/FileTreatment";
import TitleBar from "TitleBar";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const Compare = ({MonacoEditor, fetchFunction}) => {

    const [state, setState] = useState({
        fileName: "Compare JSON file",
        compareLocation: "",
        items: [],
        filters: {
            filterName: "KO",
            extensionName: "All",
            currentStatusCode: "All",
            searchedString: "",
            stringsModifier: "",
            sortTimeType: "Neutral",
            timeSide: "Left",
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
    console.log("Left parsing crash");
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
    console.log("Right parsing crash");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`
        },
        statusCodes: [{value: "All", label: "All"}],
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
                    alt="AXA Logo"
                />
            </Header>
            <TitleBar
                title={state.fileName === "Compare JSON file" ? state.fileName : "Visualising file : " + state.fileName}/>
            <FileTreatment state={state} setState={setState} MonacoEditor={MonacoEditor}  fetchFunction={fetchFunction}/>
            {state.items.length > 0 &&
            <TableResult state={state} setState={setState} MonacoEditor={MonacoEditor} fetchFunction={fetchFunction}/>
            }
            <ToastContainer/>
        </QueryClientProvider>
    );
}

export default Compare;
