import React from "react";
import ReactDOM from 'react-dom';
import R from 'ramda';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import applicationContextProvider from "engine/App/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import InlineControl from 'components/inlinecontrol';
import ActionBoundControl from 'components/actionboundcontrol';
import ErrorComp from 'components/viewcomponents/errorcontrol';
import { getError, getSchema, getField, getRawValue, getFormattedValue, set } from "appcontext";
import { makeError, ErrorTypes, getProp} from "helpers/BuilderApi";
import { ActionKeys } from "helpers/implicitactions";

class TextBox extends DataSourceBoundControl(applicationContextProvider(React.Component, "TextBox")) {
    constructor(props) {
        super(props);
        this.implicitActionsToCreate = [ActionKeys.onChange,
            ActionKeys.onBlur,
            ActionKeys.onClick,
            ActionKeys.onFocus
        ];
    }
    extractValue(e) {
        let field = getField(this.state.propLenses.dataSource),
            schema = field.get("schema"),
            format = this.state.props.format || getProp(schema, "format"),
            formattedValue = e.target.value;
        let rawValue = getRawValue(formattedValue, field, format);
        return rawValue;
    }
    getComponentProps() {
        let componentProps = {
            "label": "",
            "readOnly": false,
            "disabled": false,
            "required": false,
            "defaultValue": "",
            "placeholder": "",
            "format": "",
            "pattern": "",
            "line": 1,
            "min": -9007199254740991,
            "max": 9007199254740990,
            "step": 1
        };
        if (super.getComponentProps) {
            componentProps = _.merge({}, super.getComponentProps(), componentProps);
        }
        return componentProps;
    }
    onBlur(e) {
        this.setState({ inlineMode: false })
    }

    render() {
        let style, type = { type: "text" };
        if (this.state.props.line > 1) {
            style = { height: `${this.state.props.line * 25}px` };
            type = { componentClass: "textarea" };
        }
        if (this.state.propLenses && this.state.propLenses.dataSource) {
            let field = this.state.propLenses.dataSource ? getField(this.state.propLenses.dataSource) : null;
            if (field.getIn(["schema", "type"]) == 'number') {
                let {min, max} = field.getIn(["schema"]).toJSON();
                min = this.state.props.min ? Math.max(this.state.props.min, min) : min
                max = this.state.props.max ? Math.min(this.state.props.max, max) : max;
                type = {
                    type: "number",
                    min,
                    max,
                    step: this.state.props.step
                };
            }

        }
        return (
            <div >
                <FormControl
                    componentClass="input"
                    placeholder={this.state.props.placeholder}
                    inputRef={(ref) => { if (ref) ref.focus() } }
                    onChange={this.implicitActions.onChange.bind(this) }
                    onClick={this.implicitActions.onClick.bind(this) }
                    onFocus={this.implicitActions.onFocus.bind(this) }
                    onBlur={this.implicitActions.onBlur.bind(this) }
                    value={this.state.props.dataSource}
                    disabled={this.state.props.disabled}
                    style={style}
                    {...type}/>
            </div>);



    }
}
export default InlineControl(ActionBoundControl(TextBox));





