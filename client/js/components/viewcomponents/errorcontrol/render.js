import React from "react";
import { getField } from "appcontext";
import { label} from 'react-bootstrap';
import {getTypeHandler} from "helpers/createhandler";
let render = function () {
    if (this.firstRendered && this.props.field) {
                let {field} = this.props,
                schema = field.get("schema"),
                format= schema.get("format"),
                type = schema.get("type"),
                handler = getTypeHandler(type),
                error = field.get("error"),
                message =error? error.toJSON().toString(handler,format):"";
                return <div style={{"height": "10px","font-size":"small","color": "red","margin-top":'-10px'}}>
                    <label >{message}</label></div>
        }
        return <div style={{"height": "9px","margin-top":'-10px'}}/>;
}

export default render;