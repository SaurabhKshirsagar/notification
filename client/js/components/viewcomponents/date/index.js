import React from "react";
import ReactDOM from 'react-dom';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import R from "ramda";
import DatePicker from "react-bootstrap-date-picker";
import applicationContextProvider from "engine/App/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import ActionBoundControl from 'components/actionboundcontrol';
import InlineControl from 'components/inlinecontrol';
import ErrorComp from 'components/viewcomponents/errorcontrol';
import { getError, getSchema, getRawValue, getField, getFormattedValue } from "appcontext";
import { makeError, ErrorTypes, getProp } from "helpers/BuilderApi";
import { ActionKeys } from "helpers/implicitactions";
import moment from "moment";

class DateControl extends DataSourceBoundControl(applicationContextProvider(React.Component, "DateControl")) {
    constructor(props) {
        super(props);
        this.implicitActionsToCreate = [ActionKeys.onChange,
            ActionKeys.onBlur,
            ActionKeys.onClick,
            ActionKeys.onFocus
        ];
    }
    getComponentProps() {
        let componentProps = {
            "label": "",
            "readOnly": false,
            "required": false,
            "defaultValue": "",
            "placeholder": "",
            "format": ""
        };
        if (super.getComponentProps) {
            componentProps = _.merge({}, super.getComponentProps(), componentProps);
        }
        return componentProps;
    }
    extractValue(dateAsString) {
        let date = moment(dateAsString),
            field = getField(this.state.propLenses.dataSource),
            schema = field.get("schema"),
            format = this.state.props.format || getProp(schema, "format"),
            formattedValue = date.format(format);
        let rawValue = getRawValue(formattedValue, field,format);
        return rawValue;
    }

    onBlur(e) {
        this.setState({ inlineMode: false })
    }

    render() {
        let errorControl = null, formattedValue = null, schema = {};
        if (this.state.propLenses && this.state.propLenses.dataSource) {
            let field = getField(this.state.propLenses.dataSource);
            formattedValue = getFormattedValue(field);

            let error = getError(this.state.propLenses.dataSource) ? getError(this.state.propLenses.dataSource).toJSON() : null;
            schema = getError(this.state.propLenses.dataSource) ? getSchema(this.state.propLenses.dataSource).toJSON() : null;
            if (R.isEmpty(this.state.props.dataSource) && schema) {
                error = (schema.required || this.state.props.required) ? makeError(ErrorTypes.required, "This field is required") : null;
            }
            errorControl = <ErrorComp field={field}></ErrorComp>;
        }

        return (
            <div>
                    <DatePicker
                        placeholder={this.state.props.label}
                        ref={(ref) => { if (ref) ref.handleFocus() } }
                        dateFormat={this.state.props.format || getProp(schema, "format") }
                        onChange={this.implicitActions.onChange.bind(this) }
                         onBlur={this.implicitActions.onBlur.bind(this) }
                        value={this.state.props.dataSource} />
            </div>
        );
    }
}

export default InlineControl(ActionBoundControl(DateControl));