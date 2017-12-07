import React from "react";
import ReactDOM from 'react-dom';
import R from 'ramda';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import { makeError, ErrorTypes, getProp} from "helpers/BuilderApi";
import ErrorComp from 'components/viewcomponents/errorcontrol';
import {  getField, getRawValue, getFormattedValue } from "appcontext";
let InlineControl = function (Wrapped) {
    return class InlineControl extends Wrapped {
        constructor(props) {
            super(props);
            this.wrender = super.render;
        }
        onClick(e) {
            this.setState({ inlineMode: true })
        }
        render() {
            let errorControl = null, formattedValue = null, compnentToRender;
            if (this.state.propLenses && this.state.propLenses.dataSource) {
                let field = this.state.propLenses.dataSource ? getField(this.state.propLenses.dataSource) : null,
                    format = this.state.props.format || field.getIn(["schema", "format"])
                formattedValue = getFormattedValue(field, format);
                formattedValue = (formattedValue == null) ? "" : formattedValue;
                let {error, schema} = field.toJSON();
                errorControl = <ErrorComp field={field}></ErrorComp>;
            }

            if (this.state.inlineMode) {
                compnentToRender = <div>{super.render() }</div>;
            }
            else
                compnentToRender = <FormControl.Static 
                style={{ "borderBottom": "1px solid #b4b1b2", "width": "100%", "marginTop": "1px"}} 
                onClick={this.implicitActions.onClick.bind(this) }>
                    {`${formattedValue}`}
                </FormControl.Static>


            return (<div style={this.props.style}>
                <FormGroup controlId="formControlsText"  >
                    <ControlLabel>{this.state.props.label}</ControlLabel>
                    {compnentToRender}
                </FormGroup>
                {errorControl}
            </div>);
        }
    }
}

export default InlineControl;