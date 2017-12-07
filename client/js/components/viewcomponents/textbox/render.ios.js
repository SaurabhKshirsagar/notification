import React from "react";
import _ from "lodash";
//import {TextInput} from 'react-native';
import {Container, Content, InputGroup, Input} from 'native-base';

let render = function(){
     let style=_.merge({height:40},this.props.style);
     return (<InputGroup>
                <Input 
                      style={style}
                      placeholder={this.state.props.label}
                      onChangeText={this.implicitActions.onChange.bind(this) }
                      value={this.state.props.dataSource}
                      secureTextEntry={this.state.props.secureTextEntry}>
                </Input>
            </InputGroup>
    );
}

export default render;
