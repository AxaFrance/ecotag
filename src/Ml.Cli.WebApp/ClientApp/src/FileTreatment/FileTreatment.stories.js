import React from "react";
import "../Comparison/Compare.scss";
import "@axa-fr/react-toolkit-form-input-file/src/file.scss"
import "@axa-fr/react-toolkit-form-input-select/src/select.scss"
import "@axa-fr/react-toolkit-form-input-textarea/src/textarea.scss"
import "@axa-fr/react-toolkit-all/dist/style/af-toolkit-core.css"
import "@axa-fr/react-toolkit-all/dist/style/af-components.css"
import "@axa-fr/react-toolkit-all/dist/style/bootstrap/grid.css"
import "@axa-fr/react-toolkit-all/dist/style/bootstrap/reboot.css"

import FileTreatment from "./FileTreatment";

export default {
    title: 'File Treatment',
    component: FileTreatment,
    argTypes: {
        state: {
            table: {
                disable: true,
            }
        }
    }
};

const Template = (args) => <FileTreatment {...args}/>;

export const Default = Template.bind({});
Default.args = {
    state : {
        items:[],
        filters: {
            filterName: "KO",
            extensionName: "Tout",
            currentStatusCode: "Tout",
            searchedString: "",
            pagingSelect: 50,
            pagingCurrent: 1
        },
        statusCodes: [{value: "Tout", label:"Tout"}]
    }
}

Default.parameters = {
    controls:{
        disabled: true
    }
}
