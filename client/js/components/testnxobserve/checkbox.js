import React,{PureComponent} from 'react';
import Toggle from 'react-toggle';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import ContextProvider from './contextprovider.js';

class CheckBox extends PureComponent{
                render(){
                    return <Toggle key="t" onChange={this.props.onContextPropChange.bind(this.props.context,"value")} 
                                  checked={this.props.value} 
                                  {...this.props} />         
                }
}

CheckBox.defaultProps = {
                "value" : ""             
}
export default ContextProvider(CheckBox, (e)=>e.target.checked);
