import React from "react";

const downloadAsync = (blob, filename) => async event => {
    event.preventDefault();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

const DownloadAttachment = ({blob, filename})=> {
    return <a target="_blank" href="#" onClick={downloadAsync(blob, filename)}>{filename}</a>
}

export default DownloadAttachment;