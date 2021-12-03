import React from "react";
import default_icon from '@axa-fr/react-toolkit-core/dist/assets/icons/file.svg';
import pdf_icon from '@axa-fr/react-toolkit-core/dist/assets/icons/file-pdf.svg';
import './ImageGallery.scss';

const isImageOrPdf = (filename) => {
    const extensions = ["pdf", "png", "jpg", "jpeg", "gif", "tiff"];
    return extensions.includes(filename.split('.').pop());
}

const getFileNameFromFullPath = (filePath) => {
    return filePath.replace(/^.*[\\\/]/, '');
}

const ImageGallery = ({parentState}) => {
    
    let imageContainerSizeClassName;
    let fileNameSizeClassName;
    switch(parentState.size){
        case "64px":
            imageContainerSizeClassName = "image-container-width__small";
            fileNameSizeClassName = "filename-width__small";
            break;
        case "128px":
            imageContainerSizeClassName = "image-container-width__medium";
            fileNameSizeClassName = "filename-width__medium";
            break;
        case "256px":
            imageContainerSizeClassName = "image-container-width__normal";
            fileNameSizeClassName = "filename-width__normal";
            break;
        case "512px":
            imageContainerSizeClassName = "image-container-width__big";
            fileNameSizeClassName = "filename-width__big";
            break;
    }
    
    let sortedFiles;
    switch (parentState.sortName) {
        case "Recent to old":
            sortedFiles = parentState.files.sort((a, b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));
            break;
        case "Old to recent":
            sortedFiles = parentState.files.sort((a, b) => (a.date> b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
            break;
        case "Alphabetic desc":
            sortedFiles = parentState.files.sort((a, b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0));
            break;
        case "Alphabetic asc":
            sortedFiles = parentState.files.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            break;
    }
    
    return(
        <div className="image-gallery__container">
            {sortedFiles.map((file, index) => {
                return(
                    <div key={index} className="image-gallery__link">
                        {isImageOrPdf(file.name) ? (
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <div className={`image-gallery__image-container ${imageContainerSizeClassName}`}>
                                    {file.name.split('.').pop() === "pdf" ? (
                                        <img className="image-gallery__image" src={pdf_icon} alt={file.name}/>
                                    ) : (
                                        <img className="image-gallery__image" src={file.url} alt={file.name}/>
                                    )}
                                </div>
                                <div className={`image-gallery__filename-container ${fileNameSizeClassName}`}>
                                    <div className="image-gallery__filename">{getFileNameFromFullPath(file.name)}</div>
                                </div>
                            </a>
                        ) : (
                            <a href={file.url} download={getFileNameFromFullPath(file.name)}>
                                <div className={`image-gallery__image-container ${imageContainerSizeClassName}`}>
                                    <img className="image-gallery__image" src={default_icon} alt={file.name + "_default-icon"}/>
                                </div>
                                <div className={`image-gallery__filename-container ${fileNameSizeClassName}`}>
                                    <div className="image-gallery__filename">{getFileNameFromFullPath(file.name)}</div>
                                </div>
                            </a>
                        )}
                    </div>
                )
            })}
        </div>
    )
};

export default ImageGallery;