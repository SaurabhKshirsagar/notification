import React from "react";
import {Text} from 'react-native';
import {getTypeHandler} from "helpers/createhandler";
let render = function(){
    if (this.firstRendered && this.props.field) {
                let {field} = this.props,
                schema = field.get("schema"),
                format= schema.get("format"),
                type = schema.get("type"),
                handler = getTypeHandler(type),
                error = field.get("error"),
                message =error? error.toJSON().toString(handler,format):"";
                return <Text style={{"height": 20,"fontSize":15,"color": "red",backgroundColor:"transparent"}}>
                    {message}</Text>
        }
        return <Text style={{"height": 20,backgroundColor:"transparent"}}/>;

}

export default render;
