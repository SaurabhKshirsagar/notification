import React from "react";
import ReactDOM from 'react-dom';
import _ from "lodash";
import {exEvaluator} from 'actions/exEvaluator.js';
import {getLens, set, getField, get, Prop} from "appcontext";
import {onProcessActions} from 'actions/exEvaluator.js';

let DataSourceBoundControl = function (Wrapped) {
    return class DataSource extends Wrapped {
        constructor(props) {
            super(props);
        }
        getComponentProps() {
            let componentProps = { "dataSource": "" };
            if (super.getComponentProps){
                componentProps = _.merge({}, super.getComponentProps(), componentProps);
            }

            return componentProps;
        }
        onChange(e) {
            let {propLenses} = this.state,
                {dataSource} = propLenses || {"dataSource" : null},
                value;
            if (!dataSource){
                return;
            }
            try {
                value = this.extractValue(e);
            }
            catch (e){
                console.error(`Error in extractValue; event : ${e}, component: ${this.constructor.displayName}`);    
                return;
            }

            set(dataSource, value);
        }
    }
}

export default DataSourceBoundControl;