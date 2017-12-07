import React from "react";
import ReactDOM from 'react-dom';
import R from 'ramda';
import _ from 'lodash';
import applicationContextProvider from "engine/app/applicationContextProvider.js";
import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import InlineControl from 'components/inlinecontrol';
import ActionBoundControl from 'components/actionboundcontrol';
import { getField, getRawValue } from "appcontext";
import { getProp} from "helpers/BuilderApi";
import { ActionKeys } from "helpers/implicitactions";
import platformRender from './render';

class Button extends DataSourceBoundControl(applicationContextProvider(React.Component, "Button")) {
    constructor(props) {
        super(props);
        this.implicitActionsToCreate = [
            ActionKeys.onClick
        ];
    }

    getComponentProps() {
        let componentProps = {
            "label": "",
            "bsSize":"",
            "bsStyle":""
        };
        if (super.getComponentProps) {
            componentProps = _.merge({}, super.getComponentProps(), componentProps);
        }
        return componentProps;
    }

    render() {
        return  platformRender.call(this);
    }
}
export default ActionBoundControl(Button);





