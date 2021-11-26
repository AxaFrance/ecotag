import React from "react";
import './Compare.scss';

import StatsTable from "./StatsTable";

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
    title: 'Stats',
    component: StatsTable,
};

const Template = (args) => <StatsTable {...args}/>;

export const Default = Template.bind({});
Default.args = {
    items:allItems,
    state : {
        items:allItems,
        filters: {
            filterName:"Tout",
            extensionName: "Tout",
            currentStatusCode: "Tout",
            searchedString: "",
            pagingSelect: 50,
            pagingCurrent: 1
        },
        isStatsTableShowed: true
    }
}

Default.parameters = {
    controls:{
        disabled: true
    }
}