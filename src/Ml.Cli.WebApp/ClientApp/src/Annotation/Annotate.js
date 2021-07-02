import React, {useState} from "react";
import {Header, Name, Title} from "@axa-fr/react-toolkit-layout-header";
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import DatasetHandler from "./DatasetHandler";
import TableAnnotate from "./TableAnnotate";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

const Annotate = ({MonacoEditor}) => {

    const [state, setState] = useState({
        fileName: "Annoter un dataset",
        items: []
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
            <Title
                title={state.fileName === "Annoter un dataset" ? state.fileName : `Fichier en cours de visualisation : ${state.fileName}`}/>
            <DatasetHandler state={state} setState={setState}/>
            {state.items.length > 0 &&
            <TableAnnotate state={state} MonacoEditor={MonacoEditor}/>
            }
        </QueryClientProvider>
    );
};

export default Annotate;
