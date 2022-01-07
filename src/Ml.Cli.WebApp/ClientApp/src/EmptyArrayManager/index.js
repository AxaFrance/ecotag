import React, {Component} from "react";
import './EmptyArrayManager.scss';

class EmptyArrayManager2 extends Component {
    
    render(){
        const child = React.Children.only(this.props.children);
        if('items' in child.props){
            if(child.props.items.length){
                return <>{child}</>
            }
        }
        return <span className="empty-array__error"><b>{this.props.onEmptyArray}</b></span>
    };
}

const EmptyArrayManager = ({items, emptyArrayMessage, children}) => {
    
    return(
        <>
            {items.length ? (
                <>{children}</>
            ) : (
                <span className="empty-array__error"><b>{emptyArrayMessage}</b></span>
            )
            }
        </>
    )
    
}

export default EmptyArrayManager;