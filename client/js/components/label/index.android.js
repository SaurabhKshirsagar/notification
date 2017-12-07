import {get} from 'appcontext';
import React, {Component} from 'react';
import {Store} from "appcontext";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import applicationContextProvider from "engine/app/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import {getField,getFormattedValue} from "appcontext";
import {makeError,ErrorTypes,makeField} from "helpers/BuilderApi";

class Label extends DataSourceBoundControl(applicationContextProvider(Component, "Label")) {
    getComponentProps() {
        return {
            "dataSource": "",
            "toolTip": null,
            "placement":'top',
            "format":null,
            "type":"string",
        };
    }
    render() {
    return(<Text>this.state.props.label</Text>);
     
    }

}
export default Label