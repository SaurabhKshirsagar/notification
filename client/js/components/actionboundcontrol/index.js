import React from "react";
import ReactDOM from 'react-dom';
import {implicitActions} from "helpers/implicitactions";

let ActionBoundControl =  function (Wrapped) {
    return class ActionBound extends Wrapped {
    constructor(props) {
        super(props);
        this.implicitActions={};
        if (!this.implicitActionsToCreate) {
            return;
        }
        this.implicitActionsToCreate.forEach(actionName => {
            this.implicitActions[`${actionName}`] = implicitActions[actionName](this);
        });
    }
    }
}

export default ActionBoundControl;