import React,{PureComponent} from 'react';


import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import ContextProvider from './contextprovider.js';
import DatePicker from 'react-native-datepicker'



class DateControl extends PureComponent{
                render(){
             
                    return <DatePicker 
        style={{width:300}}
        date={this.props.value}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
    
                                onDateChange={this.props.onContextPropChange.bind(this.props.context,"value")}
                                value={this.props.value} {...this.props} />
                }
}

DateControl.defaultProps = {
                "value" : ""             
}

export default ContextProvider(DateControl, (e)=>e);