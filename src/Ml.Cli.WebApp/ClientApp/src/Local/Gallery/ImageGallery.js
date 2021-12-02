import React from "react";
import default_icon from '@axa-fr/react-toolkit-core/dist/assets/icons/file.svg';
import './ImageGallery.scss';

const ImageGallery = ({parentState}) => {
    
    const isImageOrPdf = (file) => {
        const extensions = ["pdf", "png", "jpg", "jpeg"];
        return extensions.includes(file.split('.').pop());
    }
    
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
            <a className="image-gallery__link" href="https://www.google.com/search?q=file+default+icon&rlz=1C1GCEA_enFR917FR917&oq=&aqs=chrome.0.69i59i450l8.34450j0j7&sourceid=chrome&ie=UTF-8">
                <div className="image-gallery__image-container">
                    <img className={`${imageSizeClassName}`} src={default_icon} alt="test"/>
                </div>
                <div className={`image-gallery__filename-container ${fileNameSizeClassName}`}>
                    <div className="image-gallery__filename">Fileazdlmqsdizqopmlsdlmzdsq.jpg</div>
                </div>
            </a>
            {parentState.files.map((file, index) => {
                return(
                    <div key={index}>
                        {isImageOrPdf(file.name) ? (
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    <img className="image-gallery__image" src={file.url} alt={file.name}/>
                                </a>
                            ) : (
                                <a href={file.url} download={file.url}>
                                    <img className="image-gallery__default" src={default_icon} alt="default icon"/>
                                </a>
                            )
                        } 
                    </div>
                )
            })}
        </div>
    )
};

export default ImageGallery;