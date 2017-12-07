import React,{PureComponent} from 'react';
import Toggle from 'react-toggle';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import ContextProvider from './contextprovider.js';

class ButtonContol extends PureComponent{
                render(){
                   
                    return <Button key="b" onClick={this.props.onSubmit} 
                                  {...this.props} />         
                }
}


export default ContextProvider(ButtonContol);