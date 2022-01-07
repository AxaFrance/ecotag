import React, {Component} from "react";
import './EmptyArrayManager.scss';

class EmptyArrayManager extends Component {
    
    render(){
        const child = React.Children.only(this.props.children);
        if('items' in child.props){
            if(child.props.items.length){
                return <div>{child}</div>
            }
        }
        return <span className="empty-array__error"><b>{this.props.onArrayEmpty}</b></span>
    };
}

export default EmptyArrayManager;