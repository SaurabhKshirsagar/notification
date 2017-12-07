import React,{PureComponent} from 'react';

import {Button} from 'native-base';
import ContextProvider from './contextprovider.js';

class ButtonContol extends PureComponent{
                render(){
                   
                    return <Button key="b" onPress={this.props.onSubmit} 
                                  {...this.props} />         
                }
}


export default ContextProvider(ButtonContol);