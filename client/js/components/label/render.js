import {get} from 'appcontext';
import React, {Component} from 'react';
import {Store} from "appcontext";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import applicationContextProvider from "engine/App/applicationcontextprovider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import {getField,getFormattedValue} from "appcontext";
import {makeError,ErrorTypes,makeField} from "helpers/builderapi";

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
    if (this.state.propLenses && this.state.propLenses.dataSource) {
            let field = this.state.propLenses.dataSource ? getField(this.state.propLenses.dataSource) : null,
            format = this.state.props.format || field.getIn(["schema","format"])
            formattedValue =  getFormattedValue(field,format);    
    }

        
    if(!this.state.props.toolTip || this.state.props.toolTip=="undefined"){
         return   <div style={this.props.style}>{formattedValue}</div>;  
    }
    let tooltip=<Tooltip id="tooltip" >{this.state.props.toolTip}</Tooltip>;
            return formattedValue ? <div style={this.props.style}><OverlayTrigger placement={this.state.props.placement} overlay={tooltip}>
                <div >{formattedValue}</div>
            </OverlayTrigger></div> : <div/>;
     
    }
    }
export default Label