import React from "react";
import NamedEntity from "./NamedEntity";

const labels = [
    {
        id: '#008194',
        name: "lorem ipsum",
        color: '#008194'
    },
    {
        id: '#f0904e',
        name: "other",
        color: '#f0904e'
    },
    {
        id: '#00ffa2',
        name: "amet",
        color: '#00ffa2'
    }
];

const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu mollis magna, sit amet ultricies massa. Curabitur a blandit elit. Phasellus convallis at erat ac tincidunt. Pellentesque laoreet lacinia mi, non consectetur ex efficitur et. Pellentesque lectus augue, efficitur nec lorem pharetra, mattis auctor tellus. Vivamus mollis sed turpis ac bibendum. Donec ultrices turpis elit, nec tristique enim rhoncus eget. Donec sagittis, elit at rutrum vulputate, turpis massa luctus odio, eget mollis ligula lorem sit amet urna. Phasellus sed lectus nec lectus commodo pharetra quis in purus. Sed ut felis a magna volutpat lacinia. Cras elementum lectus vel elit rutrum, et mollis metus interdum. Cras aliquam non tortor a feugiat. Phasellus sodales facilisis est, at dignissim massa tristique ac. Maecenas rhoncus luctus mi, eu pharetra justo pellentesque id. Vivamus ultrices ex a scelerisque dapibus. ";

const annotationAction = (label) => {
    console.log(label);
}

export default {
    title: 'NamedEntity',
    component: NamedEntity
}

const Template = (args) => <NamedEntity {...args}/>;

export const Default = Template.bind({});
Default.args = {
    text: text,
    labels: labels,
    annotationAction: annotationAction,
    placeholder: "Submit Annotation"
};
