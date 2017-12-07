import React from "react";
import {TextInput} from 'react-native';
let render = function(){
     return <TextInput style={this.props.style}
     placeholder={this.state.props.label}
       onChangeText={this.implicitActions.onChange.bind(this) }
         value={this.state.props.dataSource}
         secureTextEntry={this.state.props.secureTextEntry}
     >
     </TextInput>
}

export default render;
