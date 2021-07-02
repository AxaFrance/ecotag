import React from "react";
import './ImagesList.scss';

const ImagesList = ({fileUrls}) => {
    return <>
        {fileUrls.length === 0 &&
        <div className="images-error">
            <p>Aucun fichier correspondant n'a été trouvé sur votre disque.
                <br/> Plusieurs raisons sont possibles:
                <br/> - Il n'existe pas d'image correspondant à ce fichier sur votre disque;
                <br/> - L'attribut regex spécifié ne correspond à aucun fichier;
                <br/> - Le répertoire des images de ce fichier n'existe pas.
            </p>
        </div>
        }
        <div className="images-list">
            {fileUrls.map((item, index) => (
                <div key={`urlListItem ${index}`} className="images-list__item">
                    <div className="images-list__image-container"><img src={item} className="images-list__file_image" alt="file_image"/></div>
                </div>
            ))}
        </div>
    </>;
};

export default ImagesList;
