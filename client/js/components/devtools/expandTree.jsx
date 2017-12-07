import React from "react";
import Tree from "./tree.jsx";

export default class ExpandTree extends React.Component {
    render() {
        return this.props.expand /*&& this.props.expandable === this.props.name*/ ? 
               <div> <Tree node={this.props.node}  expand={true}/> </div>: 
                    null;        
    }
}