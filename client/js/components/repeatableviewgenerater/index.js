import React, { Component } from 'react';
import R from 'ramda';
import _ from 'lodash';
import { exEvaluator } from "actions/exEvaluator.js";
import isContainerComponent from "helpers/iscontainercomponent";
import { get, getLens, immLens, Prop } from "appcontext/";
import ContextProvider from '../testnxobserve/contextprovider.js';

let repeatableViewGenerater = (containerType, renderParent, renderChild, cwrpProcessor, getComponentProps = ()=>({}), renderChildWrapper = (thisRefrence, value, children) => children) => {
    return class RepeatableView extends ContextProvider(Component) {
        constructor(props) {
            super(props);
            this.flipKey = 0;
            this.constructor.displayName = containerType;
            if (!isContainerComponent(containerType)) {
                throw `${containerType} type not  mentioned in isContainerComponent.js, please register it`;
            }
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
            return _.map(items,(value, key, ds)=>{
                let valueField=this.props.valueField?this.props.valueField(value):value;
                    key=this.props.keyField?this.props.keyField(value):key;
                let child = renderChild(this, valueField, key, ds),
                    {context} = this.props;
                    
                let childWithinWrapper =  renderChildWrapper(this, valueField, React.cloneElement(child, {
                    "params":{
                        "itemKey":key,
                        "item":valueField,
                        "items":ds
                    },
                    context,
                    "uid": (("" + this.props.uid) || "") + "_" + key, key:`${key}-${this.flipKey}`
                }),key,ds);
                return React.cloneElement(childWithinWrapper,{key:`${key}-${this.flipKey}`});
            });
        }
        render() {
            let children = [];
            if (this.props.items) {
                children = this.renderChildren(this.props.items);
            }
            return renderParent(this, children);
        }
    }
}

export default repeatableViewGenerater;
