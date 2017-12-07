import React from "react";
import { Button} from 'react-bootstrap';

let render = function(){
     return <Button 
        bsStyle={this.state.props.bsStyle} 
        onClick={this.implicitActions.onClick.bind(this)}
        bsSize={this.state.props.bsSize} 
        style={this.props.style}>
        {this.state.props.label}
     </Button>
}

export default render;