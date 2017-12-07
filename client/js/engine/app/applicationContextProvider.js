import React from "react";
import _ from "lodash";
import {Store, Prop, getLens, get, resolvePropToValue} from "appcontext";
import {exEvaluator} from "actions/exEvaluator.js";

let applicationContextProvider = function (Wrapped, componentName = "") {
    return class Provider extends Wrapped {
        constructor(props){
            super(props);
            this.unsubscribe = _.noop;
            this.constructor.displayName = componentName || Wrapped.name;

            if (!this.getComponentProps){
                throw `Component ${this.constructor.name} doesn't have a getComponentProps method.`;
            }

            this.storeDefaultComponentProps();
        }
        componentDidMount() {
            if (super.componentDidMount){
                super.componentDidMount();
            }
            this.buildComponentProps((propLenses)=>{
                let propLensesSize = _.size(propLenses);
                // if (propLensesSize == 0){
                //     return;
                // }
                this.unsubscribe = Store.listen(this.onStoreNotification, this);
            });
        }
        componentWillUnmount() {
            if (super.componentWillUnmount){
                super.componentWillUnmount();
            }
            // stop listening to the Store.
            this.isUnMounting = true;
            this.unsubscribe();
        }

        // stores component's default props in this.state.props.
        // called from constructor.
        storeDefaultComponentProps(){
            this.state = _.merge({}, this.state, {props: this.getComponentProps()});
        }

        // called from collectExpressionProps
        // returns an array of lenses found in this
        // expression, along with the evaluated value.
        async getExpressionLensesAndValue(expr){
            let {params, context} = this.props,
            foundLenses = {},
            resolvePropToValueAndCaptureLens = function (propCandidate, contextObj){
                    if (Prop.isProp(propCandidate)) {
                        let lens = getLens(propCandidate, contextObj),
                        value = get(lens);
                        foundLenses[lens.key] = lens;
                        return value;
                    }
                    return propCandidate;
            },
            exprValue = await exEvaluator(expr,{params, context}, resolvePropToValueAndCaptureLens);
            if (exprValue){
                exprValue = resolvePropToValueAndCaptureLens(exprValue, {params, context});
            }
            foundLenses = _.values(foundLenses);

            return {"value" : exprValue, "lenses" : foundLenses};
        }

        // called from processStateProps
        // goes through all component props and finds those
        // bound with a lens. It also finds the current
        // values of all component props.
        // stores the lens bound props in this.state.lensProps.
        // Its a key-value object, key is lens key, value is an object
        // with prop name and true as key-value pair.
        async buildComponentProps(callback){
            let componentProps =  this.getComponentProps(),
            cps = _.keys(componentProps),
            lensProps = {},
            propLenses = {},
            propValues = {};
            for (let key of cps){
                let boundValue = this.props[key];
                if (typeof boundValue == "undefined"){
                    propValues[key] = componentProps[key];
                    continue;
                }
                let elav = await this.getExpressionLensesAndValue(boundValue);
                for (let lens of elav.lenses){
                    let lensProp = lensProps[lens.key] || {};
                    lensProp[key] = true;
                    lensProps[lens.key] = lensProp;
                }

                if (elav.lenses.length > 0){
                    propLenses[key] = elav.lenses[0];
                }

                propValues[key] = elav.value || componentProps[key];
            }

            this.setState({lensProps, propLenses, "props" : propValues}, callback(propLenses));
        }

        // When a state change occurs, this method updates all affected component props.
        // called from onStoreNotification
        async processComponentPropsChanges(matchingProps, updatedLens){
            let propChanges = _.clone(this.state.props);
            
            let {params, context} = this.props,
                affectedProps = _.keys(matchingProps);
            for (let affectedProp of affectedProps){
                // re-evaluate the prop expression.
                let expr = this.props[affectedProp],
                exprValue = await exEvaluator(expr,{params, context});

                propChanges[affectedProp] = resolvePropToValue(exprValue, {params, context});
            }

            // recheck isUnMounting as this method is async.
            if (this.isUnMounting){
                return;
            }

            if (typeof this.lensChangeWillTrigger == "function"){
                this.lensChangeWillTrigger(propChanges);
            }

            this.setState({"props" : propChanges});
        }

        onStoreNotification({lens, state}) {
            if (this.isUnMounting || !this.state.lensProps) {
                return;
            }
            
            let matchingProps = this.state.lensProps[lens.key];
            if (!matchingProps){
                return;
            }

            this.processComponentPropsChanges(matchingProps, lens);
        }
    }
}
export default applicationContextProvider;