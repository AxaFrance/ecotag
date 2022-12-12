import React from "react";
import './ImagesList.scss';

const ImagesList = ({fileUrls}) => {
    return <>
        {fileUrls.length === 0 &&
            <div className="images-error">
                <p>No related file has been found on your local hard drive.
                    <br/> There is several possibilities:
                    <br/> - There is no existing image related to this file on your hard drive;
                    <br/> - The specified regex doesn't match any file;
                    <br/> - The images repository of this file doesn't exist.
                </p>
            </div>
        }
        <div className="images-list">
            {fileUrls.map((item, index) => (
                <div key={`urlListItem ${index}`} className="images-list__item">
                    <div className="images-list__image-container"><img src={item} className="images-list__file_image"
                                                                       alt="file_image"/></div>
                </div>
            ))}
        </div>
    </>;
};

export default ImagesList;
