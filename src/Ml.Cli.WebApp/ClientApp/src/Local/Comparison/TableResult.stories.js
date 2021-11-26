import React from "react";
import './Compare.scss';
import "@axa-fr/react-toolkit-table/src/Paging/paging.scss"
import "@axa-fr/react-toolkit-table/src/table.scss"
import "@axa-fr/react-toolkit-table/src/Pager/pager.scss"

import TableResult from './TableResult';

const itemsOK = {collapse:true, fileName:"{FileNameOK}_pdf.json",id:"id",
    left:{
        Body:"[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory:"file_directory",
        StatusCode:200,
        TimeMs:0,
        Url:"https://url"
    },
    parse:false,
    right:{
        Body:"[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory:"file_directory",
        StatusCode:200,
        TimeMs:0,
        Url:"https://url"
    }
}

const itemsKO = {collapse:true, fileName:"{FileNameKO}_pdf.json",id:"id",
    left:{
        Body:"[{\"firstname\":\"firstnameError\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory:"file_directory",
        StatusCode:200,
        TimeMs:0,
        Url:"https://url"
    },
    parse:false,
    right:{
        Body:"[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory:"file_directory",
        StatusCode:200,
        TimeMs:0,
        Url:"https://url"
    }
}

const allItems = [itemsKO, itemsOK];

export default {
    title: 'TableResult',
    component: TableResult,
};

const Template = (args) => <TableResult {...args} />;

export const KOFiles = Template.bind({});
KOFiles.args = {
    state : {
        items:[itemsKO],
        filters: {
            filterName:"KO",
            extensionName: "All",
            currentStatusCode: "All",
            searchedString: "",
            pagingSelect: 50,
            pagingCurrent: 1
        }
    }
}
KOFiles.parameters = {
    controls:{
        disabled: true
    }
}

export const OKFiles = Template.bind({});
OKFiles.args = {
    state : {
        items:[itemsOK],
        filters: {
            filterName:"OK",
            extensionName: "All",
            currentStatusCode: "All",
            searchedString: "",
            pagingSelect: 50,
            pagingCurrent: 1
        }
    }
}
OKFiles.parameters = {
    controls:{
        disabled: true
    }
}

export const AllFiles = Template.bind({});
AllFiles.args = {
    state : {
        items:allItems,
        filters: {
            filterName:"All",
            extensionName: "All",
            currentStatusCode: "All",
            searchedString: "",
            pagingSelect: 50,
            pagingCurrent: 1
        }
    }
}

AllFiles.parameters = {
    controls:{
        disabled: true
    }
}

export const Empty = Template.bind({});
Empty.args = {
    state : {
        items:[],
        filters: {
            filterName:"All",
            extensionName: "All",
            currentStatusCode: "All",
            searchedString: "",
            pagingSelect: 50,
            pagingCurrent: 1
        }
    }
}

Empty.parameters = {
    controls:{
        disabled: true
    }
}