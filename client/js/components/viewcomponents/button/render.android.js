import React from "react";
import {Button} from 'react-native';

let render = function(){
     return   <Button style={this.props.style}
                  title={this.state.props.label}
                  onPress={this.implicitActions.onClick.bind(this)}>
              </Button>
}

export default render;
