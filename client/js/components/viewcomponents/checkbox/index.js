import React from "react";
import ReactDOM from 'react-dom';
import {Button, FormGroup, ControlLabel, FormControl,Checkbox} from 'react-bootstrap';
import {exEvaluator} from 'actions/exEvaluator.js';
import applicationContextProvider from "engine/App/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import DatePicker from "react-bootstrap-date-picker";
import R from "ramda";
import {ActionKeys} from "helpers/implicitactions";
import ActionBoundControl from 'components/actionboundcontrol';
import ErrorComp from 'components/viewcomponents/errorcontrol';
import Toggle from 'react-toggle';
import "../../../../styles/styles.css";

import Label from "components/label";

class CheckBoxControl extends DataSourceBoundControl(applicationContextProvider(React.Component, "CheckBoxControl")) {
    constructor(props){
        super(props);
        this.implicitActionsToCreate = [ActionKeys.onChange,
                                ActionKeys.onBlur,
                                ActionKeys.onClick,
                                ActionKeys.onFocus
                                ];
    }
    
    getComponentProps() {
        return { 
                "dataSource": "",
                "readOnly":false,
                "label":"",
                "visible":true,
                "labelPosition":"before"//["before"/"after"]
                
            };
    }
    extractValue(e){
        return e.target.checked
    }
    render() {
        
        let label = this.state.props.label,
        control=null,hide={"display":"none"},display={"display":""},
        visible = this.state.props.visible,
        value = this.state.props.dataSource?true:false,
        readOnly = this.state.props.readOnly,
        labelPosition=this.state.props.labelPosition;
        visible=!visible||visible=="undefined"?hide:display;
        if (this.error) 
            control=<ErrorComp errorMessage={this.error.message}></ErrorComp>
        

        let toggleControl=<Toggle 
                                key="t"
                                checked={value}
                                disabled={readOnly}
                                ref="formcontrol"
                                onClick={this.implicitActions.onClick.bind(this)}
                                onFocus={this.implicitActions.onFocus.bind(this)}
                                onBlur={this.implicitActions.onBlur.bind(this)}
                                onChange={this.implicitActions.onChange.bind(this)}/>
        let labelControl=<span key="l"><b>{label}</b></span> 

        return  <div style={this.props.style}>
                        <FormGroup controlId="formControlsText" style={visible} >
                             {(labelPosition=="before")? [labelControl,toggleControl]:[toggleControl,labelControl]}     
                        </FormGroup>
                       {control}
                </div>;
    }
}


export default ActionBoundControl(CheckBoxControl);

