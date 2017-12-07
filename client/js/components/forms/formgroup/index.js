import React from "react";
import ReactDOM from 'react-dom';
import {FormGroup} from 'react-bootstrap';

export default class Form_Group extends React.Component {
    render() {
        return (  
            <FormGroup style={this.props.style} >{this.props.children}</FormGroup >
        );
    }
}