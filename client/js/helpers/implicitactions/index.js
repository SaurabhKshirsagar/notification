import R from 'ramda';
import _ from 'lodash';
import {onProcessActions} from 'actions/exEvaluator.js';

let implicitActionHandler = R.curry(function(actionName, component){
return (e)=>{
    if(component[actionName])
        component[actionName](e);
    let {context, params, actions} = component.props;
    if(_.hasIn(actions,actionName)){
        let {[actionName]:action}=actions;
        onProcessActions(action, {context, params});
    }
}
}),

implicitActionKeys = ["onChange", "onClick","onFocus","onBlur"],
ActionKeys = _.keyBy(implicitActionKeys);
let implicitActions = implicitActionKeys.reduce((prev, curr )=> {
    prev[curr] = implicitActionHandler(curr)
    return prev;
}, {});

module.exports={ActionKeys,implicitActions}
