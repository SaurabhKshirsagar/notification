import React,{PureComponent} from 'react';


import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import ContextProvider from './contextprovider.js';
import DatePicker from "react-bootstrap-date-picker";



class DateControl extends PureComponent{
                render(){
             
                    return  <div ><DatePicker 
                                onChange={this.props.onContextPropChange.bind(this.props.context,"value")}
                                value={this.props.value} {...this.props} /> </div>
                }
}

DateControl.defaultProps = {
                "value" : ""             
}

export default ContextProvider(DateControl, (e)=>e);