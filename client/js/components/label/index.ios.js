import {get} from 'appcontext';
import React, {Component} from 'react';
import {Store} from "appcontext";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import applicationContextProvider from "engine/app/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import {getField,getFormattedValue} from "appcontext";
import {makeError,ErrorTypes,makeField} from "helpers/BuilderApi";
import {Text} from 'native-base';
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
        let formattedValue=this.state.props.dataSource;
        return(<Text style={this.props.style}>{formattedValue}</Text>);
     
    }

}
export default Label