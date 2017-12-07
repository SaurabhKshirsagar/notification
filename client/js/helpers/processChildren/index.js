import React from 'react';
import _ from 'lodash';
import AssetComponent from 'components/assetcomponent';
import isContainerComponent from "helpers/iscontainercomponent";

let processChildren = (state, props) => {
    let {path, params: droppedParams, ...rest} = state.props.asset.props,
        {uid, onClick} = props,
        {params} = state.props,
        type = state.props.asset.type,
        {children} = rest,
        currentContext = state.props.context;
    //parentContext = state.props.params.parent;
   // let {parent, ...otherParams} = droppedParams;
    params = _.merge({}, params, droppedParams);
    // newProps = { context: currentContext, parent: parentContext, uid, params, onClick, ...rest };
    let newProps = { context: currentContext, uid, params, onClick, ...rest };
    //let newProps=state.props.asset.props;
    if (!isContainerComponent(type) && _.isArray(children)) {
        let AssetChildren = children.map((child, index) => {
            // return <AssetComponent key={index} itemKey={index} uid={(("" + props.uid) || "") + "_" + index} asset={child} params={params} context={currentContext} parent={parentContext} />
            return <AssetComponent key={index} itemKey={index} uid={(("" + props.uid) || "") + "_" + index} asset={child} params={params} context={currentContext} />
        }),
            {children: propsChildren, path, params: droppedParams, ...other} = state.props.asset.props;
        // {children,...other}=props.asset.props;
        // newProps = { children: AssetChildren, context: currentContext, parent: parentContext, params, uid, onClick, ...other };
        newProps = { children: AssetChildren, context: currentContext, params, uid, onClick, ...other };
    }
    return newProps;
};
export default processChildren;