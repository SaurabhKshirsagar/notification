import React from "react";
import ReactDOM from 'react-dom';
import {OverlayTrigger,Tooltip} from 'react-bootstrap';
import copy from './copy.js'

const style={"color":"red",
            "textAlign":"center",
            "fontSize":"20px",
            "cursor":"pointer"
            }

let onLogErrorClick=(err)=>{
    console.log(err);
    copy(err);
;
}

export default class MyErrorHandler extends React.Component {
    constructor(props) {
    super(props);
        this.tooltip=<Tooltip id="tooltip" >
                            An error has occurred while rendering this control. 
                            Click here to log this error in console and copy it in clipboard.
                    </Tooltip>
        }

    render(){
        return (
            <div style={this.props.style} onClick={onLogErrorClick.bind(null,this.props.error)}>
                  <OverlayTrigger overlay={this.tooltip}>
                      <div style={style} >e</div>
                </OverlayTrigger>   
            </div>
        );
    }
}


  