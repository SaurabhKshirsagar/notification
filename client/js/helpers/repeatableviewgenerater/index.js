import React, { Component } from 'react';
import R from 'ramda';
import _ from 'lodash';
import { exEvaluator } from "actions/exEvaluator.js";
import applicationContextProvider from "engine/App/applicationContextProvider.js";
import isContainerComponent from "helpers/iscontainercomponent";
import { get, getLens, immLens, Prop } from "appcontext/";

let repeatableViewGenerater = (containerType, renderParent, renderChild, cwrpProcessor, getComponentProps = ()=>({}), renderChildWrapper = (thisRefrence, value, children) => children) => {
    return class RepeatableView extends applicationContextProvider(Component) {
        constructor(props) {
            super(props);
            this.flipKey = 0;
            this.constructor.displayName = containerType;
            if (!isContainerComponent(containerType)) {
                throw `${containerType} type not  mentioned in isContainerComponent.js, please register it`;
            }
        }
        getComponentProps(){
            let extendedProps = getComponentProps(this) || {};
            return {
                dataSource: [],
                ...extendedProps
            };
        }
        componentDidMount() {
            super.componentDidMount();
            if (cwrpProcessor) {
               cwrpProcessor(this, this.props);
            }
        }
        lensChangeWillTrigger(newStateProps){
            //@todo: This comparison is always returning false.
            //if (this.state.props.dataSource != newStateProps.dataSource){
                this.flipKey = 1 - this.flipKey;
            //}
        }
        renderChildren(dataSource) {
            let items = dataSource;
            return items.map((value, key, ds) => {
                let child = renderChild(this, value, key, ds),
                    {context, parent} = this.props,
                    {asset} = child.props;
                let childLens = getLens(new Prop(`.${key}`), { context: this.state.propLenses["dataSource"] });

                asset = _.merge({}, asset, { props: { hasOwnScope: true } });
                asset = _.merge({}, asset, { props: { "params": { "Parent": { "binding": this.state.propLenses["dataSource"] }, "Item": { "binding": childLens }, "ItemKey": { "binding": `"${key}"` } } } });
                //return React.cloneElement(child, { "dataSource": ds, "item": value, "itemKey": key, key });


                //   return React.cloneElement(child, { asset,
                //     "params": {"Parent":{"binding":dataSource},"Item":{"binding":R.compose(dataSource,immLens(key))},"ItemKey":{"binding":key}},
                //       context, parent,
                //        "uid": (("" + this.props.uid) || "") + "_" + key, key });


                let childWithinWrapper =  renderChildWrapper(this, value, React.cloneElement(child, {
                    asset,
                    //"params": { "Parent": { "binding": dataSource }, "Item": { "binding": R.compose(dataSource, immLens(key)) }, "ItemKey": { "binding": `"${key}"` } },
                    context,
                    "uid": (("" + this.props.uid) || "") + "_" + key, key:`${key}-${this.flipKey}`
                }));
                return React.cloneElement(childWithinWrapper,{key:`${key}-${this.flipKey}`});
            });
        }
        render() {
            let children = [];
            if (this.state.props.dataSource) {
                children = this.renderChildren(this.state.props.dataSource);
            }
            return renderParent(this, children);
        }
    }
}

export default repeatableViewGenerater;
