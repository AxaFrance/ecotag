import React from "react";
import default_icon from '@axa-fr/react-toolkit-core/dist/assets/icons/file.svg';
import './ImageGallery.scss';

const isImageOrPdf = (filename) => {
    const extensions = ["pdf", "png", "jpg", "jpeg"];
    return extensions.includes(filename.split('.').pop());
}

const isPdf = (filename) => {
    return filename.split('.'.pop() === "pdf");
}

const getFileNameFromFullPath = (filePath) => {
    return filePath.replace(/^.*[\\\/]/, '');
}

const ImageGallery = ({parentState}) => {
    
    let imageSizeClassName;
    let fileNameSizeClassName;
    switch(parentState.size){
        case "64px":
            imageSizeClassName = "image-width__small";
            fileNameSizeClassName = "filename-width__small";
            break;
        case "128px":
            imageSizeClassName = "image-width__medium";
            fileNameSizeClassName = "filename-width__medium";
            break;
        case "256px":
            imageSizeClassName = "image-width__normal";
            fileNameSizeClassName = "filename-width__normal";
            break;
        case "512px":
            imageSizeClassName = "image-width__big";
            fileNameSizeClassName = "filename-width__big";
            break;
    }
    
    return(
        <div className="image-gallery__container">
            {parentState.files.map((file, index) => {
                return(
                    <div key={index} className="image-gallery__link">
                        {isImageOrPdf(file.name) ? (
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <div className="image-gallery__image-container">
                                    {file.name.split('.').pop() === "pdf" ? (
                                        <embed className={`image-gallery__image ${imageSizeClassName}`} src={file.url}/>
                                    ) : (
                                        <img className={`image-gallery__image ${imageSizeClassName}`} src={file.url} alt={file.name}/>
                                    )}
                                </div>
                                <div className={`image-gallery__filename-container ${fileNameSizeClassName}`}>
                                    <div className="image-gallery__filename">{getFileNameFromFullPath(file.name)}</div>
                                </div>
                            </a>
                        ) : (
                            <a href={file.url} download={getFileNameFromFullPath(file.name)}>
                                <div className="image-gallery__image-container">
                                    <img className={`${imageSizeClassName}`} src={default_icon} alt={file.name + "_default-icon"}/>
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