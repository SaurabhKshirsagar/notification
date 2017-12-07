import React,{PureComponent} from 'react';
import { Label} from 'react-bootstrap';

import ContextProvider from './contextprovider.js'

class LabelComp extends PureComponent{

 render(){
                    return <Label value={this.props.value}>{this.props.value}</Label>
 }
}
LabelComp.defaultProps = {
                "value" : ""             
}
export default ContextProvider(LabelComp);
//export default LabelComp;