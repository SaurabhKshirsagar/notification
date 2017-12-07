import React from "react";
import ReactDOM from 'react-dom';
import {DropdownButton} from 'react-bootstrap';

export default class Dropdown_Button extends React.Component {
    render() {
        return <DropdownButton bsStyle={this.props.bsStyle} title={this.props.title} id={this.props.id} style={this.props.style} pullRight>
        {this.props.children}
        </DropdownButton>
    }
}
