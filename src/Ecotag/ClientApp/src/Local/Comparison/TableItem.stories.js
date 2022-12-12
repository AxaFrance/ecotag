import React from "react";
import './Compare.scss';

import TableItem from "./TableItem";

const itemsOK = {
    collapse: true, fileName: "{FileNameOK}_pdf.json", id: "id",
    left: {
        Body: "[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory: "file_directory",
        StatusCode: 200,
        TimeMs: 0,
        Url: "https://url"
    },
    parse: false,
    right: {
        Body: "[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory: "file_directory",
        StatusCode: 200,
        TimeMs: 0,
        Url: "https://url"
    }
}

const itemsKO = {
    collapse: true, fileName: "{FileNameKO}_pdf.json", id: "id",
    left: {
        Body: "[{\"firstname\":\"firstnameError\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory: "file_directory",
        StatusCode: 200,
        TimeMs: 0,
        Url: "https://url"
    },
    parse: false,
    right: {
        Body: "[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FileDirectory: "file_directory",
        StatusCode: 200,
        TimeMs: 0,
        Url: "https://url"
    }
}

const allItems = [itemsKO, itemsOK];

export default {
    title: 'TableItem',
    component: TableItem,
};

const Template = (args) => <TableItem {...args} />;

export const Default = Template.bind({});
Default.args = {
    regex: "",
    item: itemsKO,
    items: allItems,
    imageDirectory: "",
    compareLocation: "",
    fetch: fetch
}
Default.parameters = {
    controls: {
        disabled: true
    }
}