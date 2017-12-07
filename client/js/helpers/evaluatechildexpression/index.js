import Promise from "bluebird";
import { exEvaluator } from "actions/exEvaluator.js";
import { getLens, get, Prop } from "appcontext";
import Label from 'components/label';
import React from 'react';

let evaluateChildExpression = (inProps) => {
    let {asset: {props}, context, params} = inProps;
    inProps.asset.props.children = React.createElement(Label, {"dataSource":props.children, context, params}); 
    return Promise.resolve(inProps);
};

export default evaluateChildExpression;