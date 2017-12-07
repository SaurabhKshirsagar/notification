import React from "react";
import ReactDOM from 'react-dom';
import {Button, FormGroup, ControlLabel, FormControl,option} from 'react-bootstrap';
import {exEvaluator} from 'actions/exEvaluator.js';
import applicationContextProvider from "engine/App/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import R from "ramda";
import ActionBoundControl from 'components/actionboundcontrol';
import {getField,getFormattedValue} from "appcontext";
import ErrorComp from "../errorcontrol";
import {ActionKeys} from "helpers/implicitactions";


class DropdownControl extends DataSourceBoundControl(applicationContextProvider(React.Component, "DropdownControl")) {

    constructor(props){
        super(props);
        this.implicitActionsToCreate =[
                                    ActionKeys.onChange,
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
                "defaultValue":"",
                "visible":true
            };
    }

    extractValue(e){
        
        return e.target.value;
    }

    render() {

        let label = this.state.props.label,
        control=null,
        hide={"display":"none"},display={"display":""},
        visible=this.state.props.visible,
        options=[],defaultValue='';
        if (this.state.propLenses && this.state.propLenses.dataSource){
            let field = this.state.propLenses.dataSource ? getField(this.state.propLenses.dataSource): null,
            {error,schema} = field.toJSON();
            defaultValue=schema.defaultValue?schema.defaultValue:"";
            options=schema.domain?schema.domain:[];
        }
        let readOnly = this.state.props.readOnly;
        visible=!visible||visible=="undefined"?hide:display;
        if (this.error) 
            control=<ErrorComp errorMessage={this.error.message}></ErrorComp>;
        let impAct=this.implicitActions;
        return  <div style={this.props.style}>  
                        <FormGroup controlId="formControlsSelect" style={visible}>
                            <ControlLabel>{label}</ControlLabel>
                            <FormControl componentClass="select" 
                                         disabled={readOnly}
                                         ref="formcontrol" 
                                         onChange={impAct?impAct.onChange.bind(this):""} 
                                         onClick={impAct?impAct.onClick.bind(this):""}
                                         onFocus={impAct?impAct.onFocus.bind(this):""}
                                         onBlur={impAct?impAct.onBlur.bind(this):""}  
                                         >
                                            {
                                                options.map((item,index)=><option key={index}
                                                defaultValue={item==defaultValue?defaultValue:null}
                                                                           // selected={item==defaultValue?true:false} 
                                                                            value={item}
                                                                            >{item}</option>
                                                                
                                                )
                                            } 
                            </FormControl>
                        </FormGroup>
                       {control}
                </div>;
    }
}


export default ActionBoundControl(DropdownControl);



