import React from "react";

const Gallery = ({parentState}) => {
    
    console.log(parentState);
    
    return(
        <div>
            {parentState.files.map(file => {
                return(
                    <img src={URL.createObjectURL(file)} alt={file}/>
                )
            })}
        </div>
    )
};

export default Gallery;