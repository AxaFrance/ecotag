import React from "react";
import './ItemsArray.scss';

const ItemsArray = ({items, SubComponent, ...props}) => {
    
    console.log(items);
    console.log(items.length);
    
    return(
        items.length === 0 ? (
            <h3 className="items-array__error">Aucun élément !</h3>
        ) : (
            <SubComponent items={items} {...props}/>
        )
    )
    
};

export default ItemsArray;