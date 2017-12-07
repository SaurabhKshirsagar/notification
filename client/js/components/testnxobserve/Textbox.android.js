import React, {PureComponent} from 'react';
import { Container, Content, InputGroup, Input, Icon } from 'native-base';
import ContextProvider from './contextprovider.js';


class TextBox extends PureComponent {
    render() {
      
        return  <InputGroup>
        <Input onChange={this.props.onContextPropChange.bind(this.props.context, "value") }
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    {...this.props}/>
                     </InputGroup>
        
    }
}

TextBox.defaultProps = {
    "value": "",
    "placeholder": ""
}

export default ContextProvider(TextBox, (e) => e.nativeEvent.text );
