import React, {useState} from "react";
import {Header, Name} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import {QueryClient, QueryClientProvider} from "react-query";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Annotate.scss';
import Routes from "./Routes";

const queryClient = new QueryClient();

const Annotate = ({fetch}) => {

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
            <Routes state={state} setState={setState} fetch={fetch}/>
            <ToastContainer/>
        </QueryClientProvider>
    );
};

export default React.memo(Annotate);
