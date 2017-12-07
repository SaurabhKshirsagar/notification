import React from "react";
import ReactDOM from 'react-dom';
import {Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {exEvaluator,onProcessActions} from 'actions/exEvaluator.js';
import {getLens, get,set}  from "appcontext"; 

export default class TextBox extends React.Component {
    onChange() {
        let {parent, context, dataSource} = this.props;
        exEvaluator(dataSource, { parent: parent, context: context })
            .then((pInstance) => {
                let lens = getLens(pInstance, { parent: parent, context: context });
                set(lens, event.target.value);
            });
    }
    render() {
        let {label} = this.props;
        return (
            <FormGroup controlId="formControlsPassword" style={this.props.style} >
                <ControlLabel>{label}</ControlLabel>
                <FormControl type="password" placeholder={label} ref="formcontrol" onChange={this.onChange.bind(this) } />
            </FormGroup>
        );
    }
}
