import React from "react";
import {Container, Content, Button} from 'native-base';

let render = function(){
    return      <Button  
                    style={this.props.style}
                    title={this.state.props.label}
                    onPress={this.implicitActions.onClick.bind(this)}>
                        {this.state.props.label}
                </Button>
    // return (<Container>
    //             <Content>
    //                 <Button primary >
    //                         
    //                 </Button>
    //             </Content>
    //         </Container>);
}

export default render;
